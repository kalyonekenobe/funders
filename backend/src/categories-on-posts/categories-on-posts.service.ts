import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PostCategoryEntity } from 'src/post-category/entities/post-category.entity';
import { CreateCategoriesOnPostsDto } from './dto/create-categories-on-posts.dto';

@Injectable()
export class CategoriesOnPostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllPostCategories(postId: string): Promise<PostCategoryEntity[]> {
    return this.prismaService
      .$transaction(async tx => {
        await tx.post.findUniqueOrThrow({ where: { id: postId } });

        return tx.categoriesOnPosts.findMany({
          where: { postId },
          select: { postCategory: true },
        });
      })
      .then(result => result.map(item => item.postCategory));
  }

  async createPostCategories(
    postId: string,
    categories: PostCategoryEntity[],
  ): Promise<PostCategoryEntity[]> {
    return this.prismaService
      .$transaction(async tx => {
        await tx.post.findUniqueOrThrow({ where: { id: postId } });
        await tx.categoriesOnPosts.createMany({
          data: categories.map(category => ({
            postId,
            category: category.name,
          })),
          skipDuplicates: false,
        });
      })
      .then(() => categories);
  }

  async updatePostCategories(
    postId: string,
    categories: PostCategoryEntity[],
  ): Promise<PostCategoryEntity[]> {
    return this.prismaService
      .$transaction(async tx => {
        await tx.post.findUniqueOrThrow({ where: { id: postId } });
        await tx.categoriesOnPosts.deleteMany({ where: { postId } });
        await tx.categoriesOnPosts.createMany({
          data: categories.map(
            category => ({ postId, category: category.name }) as CreateCategoriesOnPostsDto,
          ),
          skipDuplicates: false,
        });
      })
      .then(() => categories);
  }

  async removePostCategories(
    postId: string,
    categories: PostCategoryEntity[],
  ): Promise<PostCategoryEntity[]> {
    return this.prismaService
      .$transaction(async tx => {
        await tx.post.findUniqueOrThrow({ where: { id: postId } });

        tx.categoriesOnPosts.deleteMany({
          where: {
            AND: {
              postId,
              category: {
                in: categories.map(category => category.name),
              },
            },
          },
        });
      })
      .then(() => categories);
  }
}
