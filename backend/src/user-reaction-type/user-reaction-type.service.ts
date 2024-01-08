import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserReactionTypeEntity } from './entities/user-reaction-type.entity';
import { CreateUserReactionTypeDto } from './dto/create-user-reaction-type.dto';
import { UpdateUserReactionTypeDto } from './dto/update-user-reaction-type.dto';

@Injectable()
export class UserReactionTypeService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<UserReactionTypeEntity[]> {
    return this.prismaService.userReactionType.findMany();
  }

  async create(data: CreateUserReactionTypeDto): Promise<UserReactionTypeEntity> {
    return this.prismaService.userReactionType.create({ data });
  }

  async update(name: string, data: UpdateUserReactionTypeDto): Promise<UserReactionTypeEntity> {
    return this.prismaService.userReactionType.update({ where: { name }, data });
  }

  async remove(name: string): Promise<UserReactionTypeEntity> {
    return this.prismaService.userReactionType.delete({ where: { name } });
  }
}
