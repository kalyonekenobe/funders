import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { PostCommentService } from './post-comment.service';
import { PostCommentController } from './post-comment.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PostCommentController],
  providers: [PostCommentService],
  exports: [PostCommentService],
})
export class PostCommentModule {}
