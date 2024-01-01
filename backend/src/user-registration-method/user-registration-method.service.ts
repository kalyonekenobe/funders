import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserRegistrationMethodDto } from './dto/create-user-registration-method.dto';
import { tryHandlePrismaError } from 'src/core/prisma/prisma.error-handling';
import { UpdateUserRegistrationMethodDto } from './dto/update-user-registration-method.dto';

@Injectable()
export class UserRegistrationMethodService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.userRegistrationMethod.findMany();
  }

  async create(data: CreateUserRegistrationMethodDto) {
    try {
      return await this.prismaService.userRegistrationMethod.create({ data });
    } catch (error: any) {
      tryHandlePrismaError(error);
    }
  }

  async update(name: string, data: UpdateUserRegistrationMethodDto) {
    try {
      return await this.prismaService.userRegistrationMethod.update({
        data,
        where: { name },
      });
    } catch (error: any) {
      tryHandlePrismaError(error);
    }
  }

  async remove(name: string) {
    try {
      return await this.prismaService.userRegistrationMethod.delete({ where: { name } });
    } catch (error: any) {
      tryHandlePrismaError(error);
    }
  }

  async findRegisteredUsersByMethodName(name: string) {
    try {
      return (
        await this.prismaService.userRegistrationMethod.findUnique({
          where: {
            name,
          },
          select: {
            users: true,
          },
        })
      ).users;
    } catch (error: any) {
      tryHandlePrismaError(error);
    }
  }
}
