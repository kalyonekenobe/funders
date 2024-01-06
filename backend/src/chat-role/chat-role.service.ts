import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ChatRoleEntity } from './entities/chat-role.entity';
import { CreateChatRoleDto } from './dto/create-chat-role.dto';
import { UpdateChatRoleDto } from './dto/update-chat-role.dto';

@Injectable()
export class ChatRoleService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<ChatRoleEntity[]> {
    return this.prismaService.chatRole.findMany();
  }

  async create(data: CreateChatRoleDto): Promise<ChatRoleEntity> {
    return this.prismaService.chatRole.create({ data });
  }

  async update(name: string, data: UpdateChatRoleDto): Promise<ChatRoleEntity> {
    return this.prismaService.chatRole.update({ where: { name }, data });
  }

  async remove(name: string): Promise<ChatRoleEntity> {
    return this.prismaService.chatRole.delete({ where: { name } });
  }
}
