import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PasswordService } from 'src/core/password/password.service';
import { UserPublicEntity } from './entities/user-public.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { exclude } from 'src/core/prisma/prisma.utils';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async findAll(): Promise<UserPublicEntity[]> {
    return this.prismaService.user.findMany({ select: exclude('User', ['password']) });
  }

  async findByPk(id: string): Promise<UserPublicEntity> {
    return this.prismaService.user.findUniqueOrThrow({
      where: { id },
      select: exclude('User', ['password']),
    });
  }

  async findByEmail(email: string): Promise<UserPublicEntity> {
    return this.prismaService.user.findUniqueOrThrow({
      where: { email },
      select: exclude('User', ['password']),
    });
  }

  async create(data: CreateUserDto): Promise<UserPublicEntity> {
    return this.prismaService.user.create({
      data: { ...data, password: await this.passwordService.hash(data.password) },
      select: exclude('User', ['password']),
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<UserPublicEntity> {
    if (data.password !== undefined) {
      data.password = await this.passwordService.hash(data.password);
    }

    return this.prismaService.user.update({
      data,
      where: { id },
      select: exclude('User', ['password']),
    });
  }

  async remove(id: string) {
    return this.prismaService.user.delete({ where: { id }, select: exclude('User', ['password']) });
  }
}
