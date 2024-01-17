import { Controller } from '@nestjs/common';
import { PostAttachmentService } from './post-attachment.service';

@Controller('post-attachments')
export class PostAttachmentController {
  constructor(private readonly postAttachmentService: PostAttachmentService) {}
}
