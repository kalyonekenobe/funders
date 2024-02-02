import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PostAttachmentEntity } from './entities/post-attachment.entity';
import { UpdatePostAttachmentDto } from './dto/update-post-attachment.dto';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';
import { CreatePostAttachmentDto } from './dto/create-post-attachment.dto';

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
    file: Express.Multer.File,
  ): Promise<PostAttachmentEntity> {
    const deprecatedFile = await this.findById(id);
    const uploadedFile = await this.cloudinaryService.uploadFile(file, {
      folder: 'post_attachments',
    });
    const resource = uploadedFile as UploadApiResponse;
    this.cloudinaryService
      .removeFiles([
        {
          resource_type: deprecatedFile.resourceType,
          public_id: deprecatedFile.file,
        },
      ])
      .catch(error => console.log(error));

    return this.prismaService.postAttachment.update({
      data: {
        ...data,
        file: resource.public_id,
        resourceType: resource.resource_type,
      },
      where: { id },
    });
  }

  async remove(id: string): Promise<PostAttachmentEntity> {
    return this.prismaService.postAttachment.delete({ where: { id } }).then(response => {
      this.cloudinaryService
        .removeFiles([{ resource_type: response.resourceType, public_id: response.file }])
        .catch(error => console.log(error));
      return response;
    });
  }
}
