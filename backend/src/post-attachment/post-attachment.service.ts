import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PostAttachmentEntity } from './entities/post-attachment.entity';
import { CreatePostAttachmentDto } from './dto/create-post-attachment.dto';
import { UpdatePostAttachmentDto } from './dto/update-post-attachment.dto';

@Injectable()
export class PostAttachmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllForPost(postId: string): Promise<PostAttachmentEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.post.findUniqueOrThrow({ where: { id: postId } });
      return tx.postAttachment.findMany({ where: { postId } });
    });
  }

  async findById(id: string): Promise<PostAttachmentEntity> {
    return this.prismaService.postAttachment.findUniqueOrThrow({ where: { id } });
  }

  async createManyForPost(
    postId: string,
    data: CreatePostAttachmentDto[],
  ): Promise<PostAttachmentEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.post.findUniqueOrThrow({ where: { id: postId } });
      return Promise.all(data.map(item => tx.postAttachment.create({ data: item })));
    });
  }

  async update(id: string, data: UpdatePostAttachmentDto): Promise<PostAttachmentEntity> {
    return this.prismaService.postAttachment.update({ data, where: { id } });
  }

  async remove(id: string): Promise<PostAttachmentEntity> {
    return this.prismaService.postAttachment.delete({ where: { id } });
  }
}
