import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UserRoleService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.userRole.findMany();
  }

  async create(data: CreateUserRoleDto) {
    return await this.prismaService.userRole.create({ data });
  }

  async update(name: string, data: UpdateUserRoleDto) {
    return await this.prismaService.userRole.update({ data, where: { name } });
  }

  async remove(name: string) {
    return await this.prismaService.userRole.delete({ where: { name } });
  }

  async findUsersWithRole(name: string) {
    return (
      await this.prismaService.userRole.findUniqueOrThrow({
        where: { name },
        select: { users: true },
      })
    ).users;
  }
}
