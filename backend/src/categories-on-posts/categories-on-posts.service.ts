import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PostCategoryEntity } from 'src/post-category/entities/post-category.entity';
import { CreateCategoriesOnPostsDto } from './dto/create-categories-on-posts.dto';

@Injectable()
export class CategoriesOnPostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllPostCategories(postId: string): Promise<PostCategoryEntity[]> {
    return (
      await this.prismaService.categoriesOnPosts.findMany({
        where: { postId },
        select: { postCategory: true },
      })
    ).map(item => item.postCategory);
  }

  async createPostCategories(
    postId: string,
    categories: PostCategoryEntity[],
  ): Promise<PostCategoryEntity[]> {
    await this.prismaService.categoriesOnPosts.createMany({
      data: categories.map(
        category => ({ postId, category: category.name }) as CreateCategoriesOnPostsDto,
      ),
    });

    return categories;
  }

  async updatePostCategories(
    postId: string,
    categories: PostCategoryEntity[],
  ): Promise<PostCategoryEntity[]> {
    await this.prismaService.categoriesOnPosts.deleteMany({ where: { postId } });
    await this.prismaService.categoriesOnPosts.createMany({
      data: categories.map(
        category => ({ postId, category: category.name }) as CreateCategoriesOnPostsDto,
      ),
    });

    return categories;
  }

  async removePostCategories(
    postId: string,
    categories: PostCategoryEntity[],
  ): Promise<PostCategoryEntity[]> {
    await this.prismaService.categoriesOnPosts.deleteMany({
      where: {
        AND: {
          postId,
          category: {
            in: categories.map(category => category.name),
          },
        },
      },
    });
    return categories;
  }
}
