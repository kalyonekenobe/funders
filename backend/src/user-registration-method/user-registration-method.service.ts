import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserRegistrationMethodDto } from './dto/create-user-registration-method.dto';
import { UpdateUserRegistrationMethodDto } from './dto/update-user-registration-method.dto';
import { UserRegistrationMethodEntity } from './entities/user-registration-method.entity';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';
import { excludeMany } from 'src/core/prisma/prisma.utils';

@Injectable()
export class UserRegistrationMethodService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<UserRegistrationMethodEntity[]> {
    return this.prismaService.userRegistrationMethod.findMany();
  }

  async create(data: CreateUserRegistrationMethodDto): Promise<UserRegistrationMethodEntity> {
    return this.prismaService.userRegistrationMethod.create({ data });
  }

  async update(
    name: string,
    data: UpdateUserRegistrationMethodDto,
  ): Promise<UserRegistrationMethodEntity> {
    return this.prismaService.userRegistrationMethod.update({
      data,
      where: { name },
    });
  }

  async remove(name: string): Promise<UserRegistrationMethodEntity> {
    return this.prismaService.userRegistrationMethod.delete({ where: { name } });
  }

  async findRegisteredUsersByMethodName(name: string): Promise<UserPublicEntity[]> {
    return excludeMany(
      (
        await this.prismaService.userRegistrationMethod.findUniqueOrThrow({
          where: {
            name,
          },
          select: {
            users: true,
          },
        })
      ).users,
      ['password'],
    );
  }
}
