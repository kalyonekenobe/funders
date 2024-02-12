import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PostCommentAttachmentEntity } from './entities/post-comment-attachment.entity';
import { UpdatePostCommentAttachmentDto } from './dto/update-post-comment-attachment.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreatePostCommentAttachmentDto } from './dto/create-post-comment-attachment.dto';
import { IPrepareSingleResourceForUpload } from 'src/core/cloudinary/cloudinary.types';

@Injectable()
export class PostCommentAttachmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAllForComment(commentId: string): Promise<PostCommentAttachmentEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.postComment.findUniqueOrThrow({ where: { id: commentId } });
      return tx.postCommentAttachment.findMany({ where: { commentId } });
    });
  }

  async findById(id: string): Promise<PostCommentAttachmentEntity> {
    return this.prismaService.postCommentAttachment.findUniqueOrThrow({ where: { id } });
  }

  async setPostCommentAttachments(
    commentId: string,
    data: CreatePostCommentAttachmentDto[],
  ): Promise<PostCommentAttachmentEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.postCommentAttachment.deleteMany({ where: { commentId } });
      await tx.postCommentAttachment.createMany({ data });

      return tx.postCommentAttachment.findMany({ where: { commentId } });
    });
  }

  async update(
    id: string,
    data: UpdatePostCommentAttachmentDto,
    file?: Express.Multer.File,
  ): Promise<PostCommentAttachmentEntity> {
    let uploader: IPrepareSingleResourceForUpload | undefined = undefined;

    if (file) {
      const attachment = await this.findById(id);
      uploader = this.cloudinaryService.prepareSingleResourceForUpload(file, {
        mapping: { [`${file.fieldname}`]: 'post_comment_attachments' },
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

    return this.prismaService.postCommentAttachment
      .update({
        data,
        where: { id },
      })
      .then(response => {
        if (uploader) uploader.upload();
        return response;
      });
  }

  async remove(id: string): Promise<PostCommentAttachmentEntity> {
    return this.prismaService.postCommentAttachment.delete({ where: { id } }).then(response => {
      const destroyer = this.cloudinaryService.prepareSingleResourceForDelete({
        ...response,
        publicId: response.file,
      });

      destroyer.delete();
      return response;
    });
  }
}
