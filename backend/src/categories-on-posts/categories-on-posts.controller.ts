import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CategoriesOnPostsService } from './categories-on-posts.service';
import { PostCategoryEntity } from 'src/post-category/entities/post-category.entity';
import ValidationPipes from 'src/core/config/validation-pipes';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/user/types/user.types';

@ApiTags('Posts')
@Controller('posts/:id/categories')
export class CategoriesOnPostsController {
  constructor(private readonly categoriesOnPostsService: CategoriesOnPostsService) {}

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_POST_CATEGORIES })
  @ApiCreatedResponse({
    description: 'The list of categories was successfully added to the post.',
    type: [PostCategoryEntity],
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The post with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot add the list of categories to the post. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to add the categories list',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Post()
  async createPostCategories(
    @Param('id') postId: string,
    @Body(ValidationPipes.parseArrayPipe(PostCategoryEntity))
    postCategoriesList: PostCategoryEntity[],
  ) {
    return this.categoriesOnPostsService.createPostCategories(postId, postCategoriesList);
  }

  @ApiOkResponse({
    description: 'The list of categories of the post',
    type: [PostCategoryEntity],
  })
  @ApiNotFoundResponse({
    description: 'Cannot find post with the specified id.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to find the categories list',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get()
  async findAllPostCategories(@Param('id') postId: string) {
    return this.categoriesOnPostsService.findAllPostCategories(postId);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_POST_CATEGORIES })
  @ApiOkResponse({
    description: 'The list of categories of the post was successfully updated.',
    type: [PostCategoryEntity],
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The post with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update the list of categories of the post. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to update the categories list',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Put()
  async updatePostCategories(
    @Param('id') postId: string,
    @Body(ValidationPipes.parseArrayPipe(PostCategoryEntity))
    postCategoriesList: PostCategoryEntity[],
  ) {
    return this.categoriesOnPostsService.updatePostCategories(postId, postCategoriesList);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_POST_CATEGORIES })
  @ApiOkResponse({
    description: 'The list of categories of the post was successfully removed.',
    type: [PostCategoryEntity],
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The post with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the post to delete the categories list',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete()
  async removePostCategories(
    @Param('id') postId: string,
    @Body(ValidationPipes.parseArrayPipe(PostCategoryEntity))
    postCategoriesList: PostCategoryEntity[],
  ) {
    return this.categoriesOnPostsService.removePostCategories(postId, postCategoriesList);
  }
}
