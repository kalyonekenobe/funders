import { Controller } from '@nestjs/common';
import { PostCategoryService } from './post-category.service';

@Controller('post-categories')
export class PostCategoryController {
  constructor(private readonly postCategoryService: PostCategoryService) {}
}
