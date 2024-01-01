import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserRegistrationMethodDto } from './dto/create-user-registration-method.dto';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class UserRegistrationMethodService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.userRegistrationMethod.findMany();
  }

  async create(data: CreateUserRegistrationMethodDto) {
    try {
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new HttpException(
          {
            error: error.message,
          },
          HttpStatus.CONFLICT,
        );
      }
    }
  }
}
