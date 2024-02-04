import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { PostAttachmentController } from './post-attachment.controller';
import { PostAttachmentService } from './post-attachment.service';
import { CloudinaryModule } from 'src/core/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [PostAttachmentController],
  providers: [PostAttachmentService],
  exports: [PostAttachmentService],
})
export class PostAttachmentModule {}
