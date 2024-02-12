import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PostCommentReactionEntity } from './entities/post-comment-reaction.entity';
import { CreatePostCommentReactionDto } from './dto/create-post-comment-reaction.dto';
import { UpdatePostCommentReactionDto } from './dto/update-post-comment-reaction.dto';

@Injectable()
export class PostCommentReactionService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllForComment(commentId: string): Promise<PostCommentReactionEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.postComment.findUniqueOrThrow({ where: { id: commentId } });
      return tx.postCommentReaction.findMany({ where: { commentId } });
    });
  }

  async findAllForUser(userId: string): Promise<PostCommentReactionEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.user.findUniqueOrThrow({ where: { id: userId } });
      return tx.postCommentReaction.findMany({ where: { userId } });
    });
  }

  async create(
    commentId: string,
    data: CreatePostCommentReactionDto,
  ): Promise<PostCommentReactionEntity> {
    return this.prismaService.postCommentReaction.create({ data: { ...data, commentId } });
  }

  async update(
    commentId: string,
    userId: string,
    data: UpdatePostCommentReactionDto,
  ): Promise<PostCommentReactionEntity> {
    return this.prismaService.postCommentReaction.update({
      where: { commentId_userId: { commentId, userId } },
      data,
    });
  }

  async remove(commentId: string, userId: string): Promise<PostCommentReactionEntity> {
    return this.prismaService.postCommentReaction.delete({
      where: { commentId_userId: { userId, commentId } },
    });
  }
}
