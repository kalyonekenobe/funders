import { Module } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageController } from './chat-message.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { CloudinaryModule } from 'src/core/cloudinary/cloudinary.module';
import { ChatMessageAttachmentModule } from 'src/chat-message-attachment/chat-message-attachment.module';

@Module({
  imports: [PrismaModule, CloudinaryModule, ChatMessageAttachmentModule],
  controllers: [ChatMessageController],
  providers: [ChatMessageService],
  exports: [ChatMessageService],
})
export class ChatMessageModule {}
