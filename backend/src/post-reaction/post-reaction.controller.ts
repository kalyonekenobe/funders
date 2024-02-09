import { Controller } from '@nestjs/common';
import { PostReactionService } from './post-reaction.service';

@Controller('post-reactions')
export class PostReactionController {
  constructor(private readonly postReactionService: PostReactionService) {}
}
