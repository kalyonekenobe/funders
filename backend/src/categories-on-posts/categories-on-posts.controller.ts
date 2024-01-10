import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesOnPostsService } from './categories-on-posts.service';

@ApiTags('Posts')
@Controller('posts/:id')
export class CategoriesOnPostsController {
  constructor(private readonly categoriesOnPostsService: CategoriesOnPostsService) {}
}
