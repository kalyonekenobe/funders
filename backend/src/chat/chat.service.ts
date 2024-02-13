import { Injectable } from '@nestjs/common';
import { Chat } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Chat[]> {
    return this.prismaService.chat.findMany();
  }

  async findById(id: string): Promise<Chat> {
    return this.prismaService.chat.findUniqueOrThrow({ where: { id } });
  }

  async create(data: CreateChatDto): Promise<Chat> {
    const chat = structuredClone(data);
    delete chat.users;

    return this.prismaService.chat.create({
      data: { ...chat, chatsOnUsers: { createMany: { data: data.users ?? [] } } },
    });
  }

  async update(id: string, data: UpdateChatDto): Promise<Chat> {
    return this.prismaService.chat.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Chat> {
    return this.prismaService.chat.delete({ where: { id } });
  }
}
