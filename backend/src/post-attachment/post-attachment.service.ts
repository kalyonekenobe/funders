import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PostAttachmentEntity } from './entities/post-attachment.entity';
import { UpdatePostAttachmentDto } from './dto/update-post-attachment.dto';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { CreatePostAttachmentDto } from './dto/create-post-attachment.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PostAttachmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAllForPost(postId: string): Promise<PostAttachmentEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.post.findUniqueOrThrow({ where: { id: postId } });
      return tx.postAttachment.findMany({ where: { postId } });
    });
  }

  async findById(id: string): Promise<PostAttachmentEntity> {
    return this.prismaService.postAttachment.findUniqueOrThrow({ where: { id } });
  }

  async setPostAttachments(
    postId: string,
    data: CreatePostAttachmentDto[],
  ): Promise<PostAttachmentEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.postAttachment.deleteMany({ where: { postId } });
      await tx.postAttachment.createMany({ data });

      return tx.postAttachment.findMany({ where: { postId } });
    });
  }

  async update(
    id: string,
    data: UpdatePostAttachmentDto,
    file?: Express.Multer.File,
  ): Promise<PostAttachmentEntity> {
    const attachment = await this.findById(id);

    if (!file) {
      throw new PrismaClientKnownRequestError('Uploaded file does not exist', {
        clientVersion: '',
        code: 'P2019',
      });
    }

    const uploader = this.cloudinaryService.prepareSingleResourceForUpload(file, {
      mapping: { [`${file.fieldname}`]: 'post_attachments' },
      beforeUpload: () => {
        const destroyer = this.cloudinaryService.prepareSingleResourceForDelete({
          ...attachment,
          publicId: attachment.file,
        });

        destroyer.delete();
      },
    });

    return this.prismaService.postAttachment
      .update({
        data: {
          ...data,
          file: uploader.resource.publicId,
          resourceType: uploader.resource.resourceType,
        },
        where: { id },
      })
      .then(response => {
        uploader.upload();
        return response;
      });
  }

  async remove(id: string): Promise<PostAttachmentEntity> {
    return this.prismaService.postAttachment.delete({ where: { id } }).then(response => {
      const destroyer = this.cloudinaryService.prepareSingleResourceForDelete({
        ...response,
        publicId: response.file,
      });

      destroyer.delete();
      return response;
    });
  }
}
