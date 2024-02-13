import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class ChatMessageAttachmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
}
