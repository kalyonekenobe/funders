import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRequestBodyFiles } from './types/post.types';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import {
  ICloudinaryLikeResource,
  IPrepareMultipleResourcesForDelete,
  IPrepareMultipleResourcesForUpload,
} from 'src/core/cloudinary/cloudinary.types';

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

  async create(data: CreatePostDto, files?: PostRequestBodyFiles): Promise<PostEntity> {
    const uploadResources: Express.Multer.File[] = [];
    let uploader: IPrepareMultipleResourcesForUpload | undefined = undefined;

    if (files?.image && files.image.length > 0) uploadResources.push(files.image[0]);
    if (files?.attachments && files.attachments.length > 0)
      uploadResources.push(...files.attachments);

    if (uploadResources.length > 0) {
      uploader = this.cloudinaryService.prepareMultipleResourcesForUpload(uploadResources, {
        mapping: { image: 'posts', attachments: 'post_attachments' },
      });
    }

    const image = uploader?.resources.find(resource => resource.fieldname === 'image');
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

    return this.prismaService.post
      .create({
        data: {
          ...data,
          image: image?.publicId ?? null,
          attachments: {
            createMany: {
              data: attachments,
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
      })
      .then(response => {
        if (uploader) uploader.upload();
        return response;
      });
  }

  async update(id: string, data: UpdatePostDto, files?: PostRequestBodyFiles): Promise<PostEntity> {
    const post = await this.prismaService.post.findUniqueOrThrow({
      where: { id },
      select: { image: true, attachments: true },
    });

    const uploadResources: Express.Multer.File[] = [];
    const deleteResources: ICloudinaryLikeResource[] = [];
    let uploader: IPrepareMultipleResourcesForUpload | undefined = undefined;
    let destroyer: IPrepareMultipleResourcesForDelete | undefined = undefined;

    if (files?.image && files.image.length > 0) uploadResources.push(files.image[0]);
    if (files?.attachments && files.attachments.length > 0)
      uploadResources.push(...files.attachments);

    if (uploadResources.length > 0) {
      uploader = this.cloudinaryService.prepareMultipleResourcesForUpload(uploadResources, {
        mapping: { image: 'posts', attachments: 'post_attachments' },
      });
    }

    const image = uploader?.resources.find(resource => resource.fieldname === 'image');
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

    if (((files?.image && files.image.length > 0) || data.image !== undefined) && post.image) {
      deleteResources.push({ publicId: post.image, resourceType: 'image' });
    }

    if (
      ((files?.attachments && files.attachments.length > 0) || files?.attachments !== undefined) &&
      post.attachments.length > 0
    ) {
      deleteResources.push(
        ...post.attachments.map(({ file, resourceType }) => ({ publicId: file, resourceType })),
      );
    }

    if (deleteResources.length > 0) {
      destroyer = this.cloudinaryService.prepareMultipleResourcesForDelete(deleteResources);
    }

    return this.prismaService.post
      .update({
        where: { id },
        data: {
          ...data,
          image: image?.publicId ?? null,
          attachments: {
            deleteMany: {},
            createMany: {
              data: attachments,
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
      })
      .then(response => {
        if (uploader) uploader.upload();
        if (destroyer) destroyer.delete();
        return response;
      });
  }

  async remove(id: string): Promise<PostEntity> {
    return this.prismaService.post
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

        if (response.image) {
          deleteResources.push({ publicId: response.image, resourceType: 'image' });
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
