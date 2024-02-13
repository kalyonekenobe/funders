import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { ChatRoleModule } from 'src/chat-role/chat-role.module';
import { ChatsOnUsersModule } from 'src/chats-on-users/chats-on-users.module';
import { ChatMessageModule } from 'src/chat-message/chat-message.module';

@Module({
  imports: [PrismaModule, ChatRoleModule, ChatsOnUsersModule, ChatMessageModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
