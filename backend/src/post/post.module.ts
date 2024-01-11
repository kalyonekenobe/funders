import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { PostCategoryModule } from 'src/post-category/post-category.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CategoriesOnPostsModule } from 'src/categories-on-posts/catgories-on-posts.module';

@Module({
  imports: [PrismaModule, PostCategoryModule, CategoriesOnPostsModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
