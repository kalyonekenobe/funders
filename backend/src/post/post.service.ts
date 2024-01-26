import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostAttachmentDto } from 'src/post-attachment/dto/create-post-attachment.dto';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

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

  async create(data: CreatePostDto): Promise<PostEntity> {
    return this.prismaService.post.create({
      data: {
        ...data,
        attachments: {
          createMany: {
            data: data.attachments ?? [],
            skipDuplicates: false,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdatePostDto): Promise<PostEntity> {
    return this.prismaService.post.update({
      where: { id },
      data: {
        ...data,
        attachments: {
          updateMany: {
            data: data.attachments ?? [],
            where: { postId: id },
          },
          createMany: {
            data:
              data.attachments?.map(
                attachment => ({ ...attachment, postId: id }) as CreatePostAttachmentDto,
              ) ?? [],
            skipDuplicates: true,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<PostEntity> {
    return this.prismaService.post.delete({ where: { id } });
  }
}
