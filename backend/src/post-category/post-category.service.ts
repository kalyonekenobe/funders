import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PostCategoryEntity } from './entities/post-category.entity';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category.dto';

@Injectable()
export class PostCategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<PostCategoryEntity[]> {
    return this.prismaService.postCategory.findMany();
  }

  async create(data: CreatePostCategoryDto): Promise<PostCategoryEntity> {
    return this.prismaService.postCategory.create({ data });
  }

  async update(name: string, data: UpdatePostCategoryDto): Promise<PostCategoryEntity> {
    return this.prismaService.postCategory.update({ where: { name }, data });
  }

  async remove(name: string): Promise<PostCategoryEntity> {
    return this.prismaService.postCategory.delete({ where: { name } });
  }
}
