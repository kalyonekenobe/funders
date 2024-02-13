import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { ChatsOnUsersController } from './chats-on-users.controller';
import { ChatsOnUsersService } from './chats-on-users.service';

@Module({
  imports: [PrismaModule],
  controllers: [ChatsOnUsersController],
  providers: [ChatsOnUsersService],
  exports: [ChatsOnUsersService],
})
export class ChatsOnUsersModule {}
