import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { PostCategoryController } from './post-category.controller';
import { PostCategoryService } from './post-category.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostCategoryController],
  providers: [PostCategoryService],
  exports: [PostCategoryService],
})
export class PostCategoryModule {}
