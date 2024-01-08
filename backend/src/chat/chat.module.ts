import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { ChatRoleModule } from 'src/chat-role/chat-role.module';

@Module({
  imports: [PrismaModule, ChatRoleModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
