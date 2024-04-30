import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ChatMessageEntity } from './entities/chat-message.entity';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { ChatMessageRequestBodyFiles } from './types/chat-message.types';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import {
  ICloudinaryLikeResource,
  IPrepareMultipleResourcesForDelete,
  IPrepareMultipleResourcesForUpload,
} from 'src/core/cloudinary/cloudinary.types';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';

@Injectable()
export class ChatMessageService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAllForChat(chatId: string): Promise<ChatMessageEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.chat.findUniqueOrThrow({ where: { id: chatId } });
      return tx.chatMessage.findMany({ where: { chatId }, include: { replies: true } });
    });
  }

  async findById(id: string): Promise<ChatMessageEntity> {
    return this.prismaService.chatMessage.findUniqueOrThrow({ where: { id } });
  }

  async create(
    chatId: string,
    data: CreateChatMessageDto,
    files?: ChatMessageRequestBodyFiles,
  ): Promise<ChatMessageEntity> {
    const uploadResources: Express.Multer.File[] = [];
    let uploader: IPrepareMultipleResourcesForUpload | undefined = undefined;

    if (files?.attachments && files.attachments.length > 0)
      uploadResources.push(...files.attachments);

    if (uploadResources.length > 0) {
      uploader = this.cloudinaryService.prepareMultipleResourcesForUpload(uploadResources, {
        mapping: { attachments: 'chat_message_attachments' },
      });
    }

    const uploadAttachments = uploader?.resources.filter(
      resources => resources.fieldname === 'attachments',
    );

    const attachments = uploadAttachments
      ? files?.attachments?.map((_, index) => ({
          ...data.attachments?.[index],
          file: uploadAttachments[index].publicId,
          resourceType: uploadAttachments[index].resourceType,
        })) ?? []
      : [];

    return this.prismaService.chatMessage
      .create({
        data: {
          ...data,
          chatId,
          attachments: {
            createMany: {
              data: attachments,
              skipDuplicates: false,
            },
          },
        },
      })
      .then(async response => {
        if (uploader) await uploader.upload();
        return response;
      });
  }

  async update(
    id: string,
    data: UpdateChatMessageDto,
    files?: ChatMessageRequestBodyFiles,
  ): Promise<ChatMessageEntity> {
    const chatMessage = await this.prismaService.chatMessage.findUniqueOrThrow({
      where: { id },
      select: { attachments: true },
    });

    const uploadResources: Express.Multer.File[] = [];
    const deleteResources: ICloudinaryLikeResource[] = [];
    let uploader: IPrepareMultipleResourcesForUpload | undefined = undefined;
    let destroyer: IPrepareMultipleResourcesForDelete | undefined = undefined;
    let deleteAttachmentsOptions = {};

    if (files?.attachments && files.attachments.length > 0)
      uploadResources.push(...files.attachments);

    if (uploadResources.length > 0) {
      uploader = this.cloudinaryService.prepareMultipleResourcesForUpload(uploadResources, {
        mapping: { attachments: 'chat_message_attachments' },
      });
    }

    const uploadAttachments = uploader?.resources.filter(
      resources => resources.fieldname === 'attachments',
    );

    const attachments = uploadAttachments
      ? files?.attachments?.map((_, index) => ({
          ...data.attachments?.[index],
          file: uploadAttachments[index].publicId,
          resourceType: uploadAttachments[index].resourceType,
        })) ?? []
      : [];

    if (
      ((files?.attachments && files.attachments.length > 0) || files?.attachments !== undefined) &&
      chatMessage.attachments.length > 0
    ) {
      deleteResources.push(
        ...chatMessage.attachments.map(({ file, resourceType }) => ({
          publicId: file,
          resourceType,
        })),
      );

      deleteAttachmentsOptions = { deleteMany: {} };
    }

    if (deleteResources.length > 0) {
      destroyer = this.cloudinaryService.prepareMultipleResourcesForDelete(deleteResources);
    }

    return this.prismaService.chatMessage
      .update({
        where: { id },
        data: {
          ...data,
          attachments: {
            ...deleteAttachmentsOptions,
            createMany: {
              data: attachments,
              skipDuplicates: false,
            },
          },
        },
      })
      .then(async response => {
        if (uploader) await uploader.upload();
        if (destroyer) destroyer.delete();
        return response;
      });
  }

  async remove(id: string): Promise<ChatMessageEntity> {
    return this.prismaService.chatMessage
      .delete({ where: { id }, include: { attachments: true } })
      .then(response => {
        const deleteResources: ICloudinaryLikeResource[] = [];

        if (response.attachments.length > 0) {
          deleteResources.push(
            ...response.attachments.map(({ file, resourceType }) => ({
              publicId: file,
              resourceType,
            })),
          );
        }

        if (deleteResources.length > 0) {
          const destroyer =
            this.cloudinaryService.prepareMultipleResourcesForDelete(deleteResources);

          destroyer.delete();
        }

        return response;
      });
  }
}
