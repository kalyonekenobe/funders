import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostCommentService } from './post-comment.service';

@ApiTags('Post comments')
@Controller('post-comments')
export class PostCommentController {
  constructor(private readonly postCommentService: PostCommentService) {}
}
