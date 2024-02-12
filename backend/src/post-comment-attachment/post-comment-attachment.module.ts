import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/core/cloudinary/cloudinary.module';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { PostCommentAttachmentController } from './post-comment-attachment.controller';
import { PostCommentAttachmentService } from './post-comment-attachment.service';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [PostCommentAttachmentController],
  providers: [PostCommentAttachmentService],
  exports: [PostCommentAttachmentService],
})
export class PostCommentAttachmentModule {}
