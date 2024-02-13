import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/core/cloudinary/cloudinary.module';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { ChatMessageAttachmentController } from './chat-message-attachment.controller';
import { ChatMessageAttachmentService } from './chat-message-attachment.service';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [ChatMessageAttachmentController],
  providers: [ChatMessageAttachmentService],
  exports: [ChatMessageAttachmentService],
})
export class ChatMessageAttachmentModule {}
