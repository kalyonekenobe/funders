import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostCommentAttachmentService } from './post-comment-attachment.service';

@ApiTags('Post comment attachments')
@Controller('comment-attachments')
export class PostCommentAttachmentController {
  constructor(private readonly postCommentAttachmentService: PostCommentAttachmentService) {}
}
