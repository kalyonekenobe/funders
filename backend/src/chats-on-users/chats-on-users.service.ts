import { Injectable } from '@nestjs/common';
import { ChatEntity } from 'src/chat/entities/chat.entity';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { exclude } from 'src/core/prisma/prisma.utils';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';
import { CreateChatsOnUsersDto } from './dto/create-chats-on-users.dto';
import { ChatsOnUsersEntity } from './entities/chats-on-users.entity';
import { UpdateChatsOnUsersDto } from './dto/update-chats-on-users.dto';

@Injectable()
export class ChatsOnUsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllChatsForUser(userId: string): Promise<ChatEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.user.findUniqueOrThrow({ where: { id: userId } });

      return tx.chatsOnUsers
        .findMany({ where: { userId }, select: { chat: true } })
        .then(response => response.map(item => item.chat));
    });
  }

  async findAllUsersForChat(chatId: string): Promise<UserPublicEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.chat.findUniqueOrThrow({ where: { id: chatId } });

      return tx.chatsOnUsers
        .findMany({
          where: { chatId },
          select: { user: { select: exclude('User', ['password']) } },
        })
        .then(response => response.map(item => item.user));
    });
  }

  async findById(chatId: string, userId: string): Promise<ChatsOnUsersEntity> {
    return this.prismaService.chatsOnUsers.findUniqueOrThrow({
      where: { chatId_userId: { chatId, userId } },
    });
  }

  async create(chatId: string, data: CreateChatsOnUsersDto): Promise<ChatsOnUsersEntity> {
    return this.prismaService.$transaction(async tx => {
      await tx.chat.findUniqueOrThrow({ where: { id: chatId } });

      return tx.chatsOnUsers.create({ data: { ...data, chatId } });
    });
  }

  async update(
    chatId: string,
    userId: string,
    data: UpdateChatsOnUsersDto,
  ): Promise<ChatsOnUsersEntity> {
    return this.prismaService.$transaction(async tx => {
      await tx.chat.findUniqueOrThrow({ where: { id: chatId } });
      await tx.user.findUniqueOrThrow({ where: { id: userId } });

      return tx.chatsOnUsers.update({ where: { chatId_userId: { chatId, userId } }, data });
    });
  }

  async remove(chatId: string, userId: string): Promise<ChatsOnUsersEntity> {
    return this.prismaService.$transaction(async tx => {
      await tx.chat.findUniqueOrThrow({ where: { id: chatId } });
      await tx.user.findUniqueOrThrow({ where: { id: userId } });

      return tx.chatsOnUsers.delete({ where: { chatId_userId: { chatId, userId } } });
    });
  }
}
