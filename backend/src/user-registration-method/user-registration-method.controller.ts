import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/core/prisma/prisma.service';

@ApiTags('UserRegistrationMethods')
@Controller('user-registration-methods')
export class UserRegistrationMethodController {
  constructor(private readonly prismaService: PrismaService) {}
}
