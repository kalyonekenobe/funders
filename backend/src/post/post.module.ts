import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { PostCategoryModule } from 'src/post-category/post-category.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CategoriesOnPostsModule } from 'src/categories-on-posts/categories-on-posts.module';
import { PostAttachmentModule } from 'src/post-attachment/post-attachment.module';

@Module({
  imports: [PrismaModule, PostCategoryModule, CategoriesOnPostsModule, PostAttachmentModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
