import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { PostCommentReactionController } from './post-comment-reaction.controller';
import { PostCommentReactionService } from './post-comment-reaction.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostCommentReactionController],
  providers: [PostCommentReactionService],
  exports: [PostCommentReactionService],
})
export class PostCommentReactionModule {}
