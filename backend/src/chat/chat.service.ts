import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatEntity } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<ChatEntity[]> {
    return this.prismaService.chat.findMany();
  }

  async findById(id: string): Promise<ChatEntity> {
    return this.prismaService.chat.findUniqueOrThrow({ where: { id } });
  }

  async create(data: CreateChatDto): Promise<ChatEntity> {
    const chat = structuredClone(data);
    delete chat.users;

    return this.prismaService.chat.create({
      data: { ...chat, chatsOnUsers: { createMany: { data: data.users ?? [] } } },
      select: { id: true, name: true, chatsOnUsers: false },
    });
  }

  async update(id: string, data: UpdateChatDto): Promise<ChatEntity> {
    return this.prismaService.chat.update({ where: { id }, data });
  }

  async remove(id: string): Promise<ChatEntity> {
    return this.prismaService.chat.delete({ where: { id } });
  }
}
