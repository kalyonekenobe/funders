import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserRegistrationMethodDto } from './dto/create-user-registration-method.dto';
import { UpdateUserRegistrationMethodDto } from './dto/update-user-registration-method.dto';

@Injectable()
export class UserRegistrationMethodService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.userRegistrationMethod.findMany();
  }

  async create(data: CreateUserRegistrationMethodDto) {
    return await this.prismaService.userRegistrationMethod.create({ data });
  }

  async update(name: string, data: UpdateUserRegistrationMethodDto) {
    return await this.prismaService.userRegistrationMethod.update({
      data,
      where: { name },
    });
  }

  async remove(name: string) {
    return await this.prismaService.userRegistrationMethod.delete({ where: { name } });
  }

  async findRegisteredUsersByMethodName(name: string) {
    return (
      await this.prismaService.userRegistrationMethod.findUniqueOrThrow({
        where: {
          name,
        },
        select: {
          users: true,
        },
      })
    ).users;
  }
}
