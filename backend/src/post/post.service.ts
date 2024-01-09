import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prismeService: PrismaService) {}
}
