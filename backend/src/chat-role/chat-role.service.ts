import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class ChatRoleService {
  constructor(private readonly prismaService: PrismaService) {}
}