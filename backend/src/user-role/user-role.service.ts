import { Get, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class UserRoleService {
  constructor(private readonly prismaService: PrismaService) {}
}
