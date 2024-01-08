import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRoleEntity } from './entities/user-role.entity';

@Injectable()
export class UserRoleService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<UserRoleEntity[]> {
    return this.prismaService.userRole.findMany();
  }

  async create(data: CreateUserRoleDto): Promise<UserRoleEntity> {
    return this.prismaService.userRole.create({ data });
  }

  async update(name: string, data: UpdateUserRoleDto): Promise<UserRoleEntity> {
    return this.prismaService.userRole.update({ data, where: { name } });
  }

  async remove(name: string): Promise<UserRoleEntity> {
    return this.prismaService.userRole.delete({ where: { name } });
  }
}
