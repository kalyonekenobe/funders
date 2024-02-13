import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { PostCommentRequestBodyFiles } from './types/post-comment.types';
import { PostCommentEntity } from './entities/post-comment.entity';
import {
  ICloudinaryLikeResource,
  IPrepareMultipleResourcesForDelete,
  IPrepareMultipleResourcesForUpload,
} from 'src/core/cloudinary/cloudinary.types';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';

@Injectable()
export class PostCommentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAllForPost(postId: string): Promise<PostCommentEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.post.findUniqueOrThrow({ where: { id: postId } });
      return tx.postComment.findMany({ where: { postId }, include: { replies: true } });
    });
  }

  async findAllForUser(authorId: string): Promise<PostCommentEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.user.findUniqueOrThrow({ where: { id: authorId } });
      return tx.postComment.findMany({ where: { authorId }, include: { replies: true } });
    });
  }

  async findById(id: string): Promise<PostCommentEntity> {
    return this.prismaService.postComment.findUniqueOrThrow({ where: { id } });
  }

  async create(
    postId: string,
    data: CreatePostCommentDto,
    files?: PostCommentRequestBodyFiles,
  ): Promise<PostCommentEntity> {
    const uploadResources: Express.Multer.File[] = [];
    let uploader: IPrepareMultipleResourcesForUpload | undefined = undefined;

    if (files?.attachments && files.attachments.length > 0)
      uploadResources.push(...files.attachments);

    if (uploadResources.length > 0) {
      uploader = this.cloudinaryService.prepareMultipleResourcesForUpload(uploadResources, {
        mapping: { attachments: 'post_comment_attachments' },
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

    return this.prismaService.postComment
      .create({
        data: {
          ...data,
          postId,
          attachments: {
            createMany: {
              data: attachments,
              skipDuplicates: false,
            },
          },
        },
      })
      .then(response => {
        if (uploader) uploader.upload();
        return response;
      });
  }

  async update(
    id: string,
    data: UpdatePostCommentDto,
    files?: PostCommentRequestBodyFiles,
  ): Promise<PostCommentEntity> {
    const postComment = await this.prismaService.postComment.findUniqueOrThrow({
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
        mapping: { attachments: 'post_comment_attachments' },
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
      postComment.attachments.length > 0
    ) {
      deleteResources.push(
        ...postComment.attachments.map(({ file, resourceType }) => ({
          publicId: file,
          resourceType,
        })),
      );

      deleteAttachmentsOptions = { deleteMany: {} };
    }

    if (deleteResources.length > 0) {
      destroyer = this.cloudinaryService.prepareMultipleResourcesForDelete(deleteResources);
    }

    return this.prismaService.postComment
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
      .then(response => {
        if (uploader) uploader.upload();
        if (destroyer) destroyer.delete();
        return response;
      });
  }

  async remove(id: string): Promise<PostCommentEntity> {
    return this.prismaService.postComment
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
