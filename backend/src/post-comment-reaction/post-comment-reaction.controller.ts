import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostCommentReactionService } from './post-comment-reaction.service';

@ApiTags('Post comment reactions')
@Controller('comments')
export class PostCommentReactionController {
  constructor(private readonly postCommentReactionService: PostCommentReactionService) {}
}
