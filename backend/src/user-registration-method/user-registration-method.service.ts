import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserRegistrationMethodDto } from './dto/create-user-registration-method.dto';
import { UpdateUserRegistrationMethodDto } from './dto/update-user-registration-method.dto';
import { UserRegistrationMethodEntity } from './entities/user-registration-method.entity';

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
}
