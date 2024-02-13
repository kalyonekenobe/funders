import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ChatMessageAttachmentEntity } from './entities/chat-message-attachment.entity';
import { UpdateChatMessageAttachmentDto } from './dto/update-chat-message-attachment.dto';
import { IPrepareSingleResourceForUpload } from 'src/core/cloudinary/cloudinary.types';
import { CreateChatMessageAttachmentDto } from './dto/create-chat-message-attachment.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ChatMessageAttachmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAllForChatMessage(messageId: string): Promise<ChatMessageAttachmentEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.chatMessage.findUniqueOrThrow({ where: { id: messageId } });
      return tx.chatMessageAttachment.findMany({ where: { messageId } });
    });
  }

  async findById(id: string): Promise<ChatMessageAttachmentEntity> {
    return this.prismaService.chatMessageAttachment.findUniqueOrThrow({ where: { id } });
  }

  async setChatMessageAttachments(
    messageId: string,
    data: CreateChatMessageAttachmentDto[],
  ): Promise<ChatMessageAttachmentEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.chatMessageAttachment.deleteMany({ where: { messageId } });
      await tx.chatMessageAttachment.createMany({ data });

      return tx.chatMessageAttachment.findMany({ where: { messageId } });
    });
  }

  async update(
    id: string,
    data: UpdateChatMessageAttachmentDto,
    file?: Express.Multer.File,
  ): Promise<ChatMessageAttachmentEntity> {
    let uploader: IPrepareSingleResourceForUpload | undefined = undefined;

    if (file) {
      const attachment = await this.findById(id);
      uploader = this.cloudinaryService.prepareSingleResourceForUpload(file, {
        mapping: { [`${file.fieldname}`]: 'chat_message_attachments' },
        beforeUpload: () => {
          const destroyer = this.cloudinaryService.prepareSingleResourceForDelete({
            ...attachment,
            publicId: attachment.file,
          });

          destroyer.delete();
        },
      });

      data = {
        ...data,
        file: uploader.resource.publicId,
        resourceType: uploader.resource.resourceType,
      };
    }

    if (!file && data.file !== undefined) {
      throw new PrismaClientKnownRequestError('The file was not provided!', {
        code: 'C2000',
        clientVersion: '',
      });
    }

    return this.prismaService.chatMessageAttachment
      .update({
        data,
        where: { id },
      })
      .then(response => {
        if (uploader) uploader.upload();
        return response;
      });
  }

  async remove(id: string): Promise<ChatMessageAttachmentEntity> {
    return this.prismaService.chatMessageAttachment.delete({ where: { id } }).then(response => {
      const destroyer = this.cloudinaryService.prepareSingleResourceForDelete({
        ...response,
        publicId: response.file,
      });

      destroyer.delete();
      return response;
    });
  }
}
