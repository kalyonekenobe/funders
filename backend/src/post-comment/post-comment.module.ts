import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { PostCommentService } from './post-comment.service';
import { PostCommentController } from './post-comment.controller';
import { CloudinaryModule } from 'src/core/cloudinary/cloudinary.module';
import { PostCommentAttachmentModule } from 'src/post-comment-attachment/post-comment-attachment.module';

@Module({
  imports: [PrismaModule, CloudinaryModule, PostCommentAttachmentModule],
  controllers: [PostCommentController],
  providers: [PostCommentService],
  exports: [PostCommentService],
})
export class PostCommentModule {}
