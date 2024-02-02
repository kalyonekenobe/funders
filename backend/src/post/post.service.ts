import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostAttachmentDto } from 'src/post-attachment/dto/create-post-attachment.dto';
import { PostRequestBodyFiles, RemovePostFilesOptions } from './post.types';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';
import { CreateCategoriesOnPostsDto } from 'src/categories-on-posts/dto/create-categories-on-posts.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(): Promise<PostEntity[]> {
    return this.prismaService.post.findMany();
  }

  async findById(id: string): Promise<PostEntity> {
    return this.prismaService.post.findUniqueOrThrow({ where: { id } });
  }

  async findAllUserPosts(userId: string): Promise<PostEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.user.findUniqueOrThrow({ where: { id: userId } });
      return tx.post.findMany({ where: { authorId: userId } });
    });
  }

  async create(data: CreatePostDto, files: PostRequestBodyFiles): Promise<PostEntity> {
    const [image, attachments] = await this.uploadRequestBodyFiles(data, files);

    return this.prismaService.post.create({
      data: {
        ...data,
        image,
        attachments: {
          createMany: {
            data: attachments ?? [],
            skipDuplicates: false,
          },
        },
        categories: {
          createMany: {
            data: data.categories ?? [],
            skipDuplicates: false,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdatePostDto, files: PostRequestBodyFiles): Promise<PostEntity> {
    this.removeRequestBodyFiles(id);
    const [image, attachments] = await this.uploadRequestBodyFiles(data, files);

    return this.prismaService.post.update({
      where: { id },
      data: {
        ...data,
        image,
        attachments: {
          deleteMany: {},
          createMany: {
            data: attachments ?? [],
            skipDuplicates: false,
          },
        },
        categories: {
          deleteMany: {},
          createMany: {
            data: data.categories ?? [],
            skipDuplicates: true,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<PostEntity> {
    this.removeRequestBodyFiles(id);
    return this.prismaService.post.delete({ where: { id } });
  }

  private async removeRequestBodyFiles(
    postId: string,
    options: RemovePostFilesOptions = { image: true, attachments: true },
  ): Promise<void> {
    const post = await this.prismaService.post.findUniqueOrThrow({
      where: { id: postId },
      select: { image: true, attachments: true },
    });

    if (options.image && post.image) {
      this.cloudinaryService.removeFiles([{ public_id: post.image, resource_type: 'image' }]);
    }

    if (options.attachments && post.attachments.length > 0) {
      this.cloudinaryService.removeFiles(
        post.attachments.map(attachment => ({
          public_id: attachment.file,
          resource_type: attachment.resourceType,
        })),
      );
    }
  }

  private async uploadRequestBodyFiles(
    data: CreatePostDto | UpdatePostDto,
    files: PostRequestBodyFiles,
  ): Promise<[string | null, Omit<CreatePostAttachmentDto, 'postId'>[]]> {
    let image: string | null = null;
    let attachments: Omit<CreatePostAttachmentDto, 'postId'>[] = [];

    if (files.image?.length && files.image.length > 0) {
      const resource = (
        await this.cloudinaryService.uploadFiles(files.image, {
          folder: 'posts',
        })
      )[0] as UploadApiResponse;
      image = resource.public_id ?? null;
    }

    if (files.attachments?.length && files.attachments.length > 0) {
      attachments = (
        await this.cloudinaryService.uploadFiles(files.attachments, {
          folder: 'post_attachments',
        })
      ).map((attachment, index) => {
        const resource = attachment as UploadApiResponse;
        const filename = data.attachments?.[index]?.filename
          ? data.attachments?.[index]?.filename
          : null;

        return {
          ...data.attachments?.[index],
          file: resource.public_id,
          filename,
          resourceType: resource.resource_type,
        };
      });
    }

    return [image, attachments];
  }
}
