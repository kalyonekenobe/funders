import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { CategoriesOnPostsController } from './categories-on-posts.controller';
import { CategoriesOnPostsService } from './categories-on-posts.service';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriesOnPostsController],
  providers: [CategoriesOnPostsService],
  exports: [CategoriesOnPostsService],
})
export class CategoriesOnPostsModule {}
