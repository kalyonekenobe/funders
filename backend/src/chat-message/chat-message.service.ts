import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class ChatMessageService {
  constructor(private readonly prismaService: PrismaService) {}
}
