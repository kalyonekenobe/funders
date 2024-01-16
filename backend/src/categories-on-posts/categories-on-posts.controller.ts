import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesOnPostsService } from './categories-on-posts.service';
import { PostCategoryEntity } from 'src/post-category/entities/post-category.entity';
import { throwHttpExceptionBasedOnErrorType } from 'src/core/error-handling/error-handler';
import ValidationPipes from 'src/core/config/validation-pipes';

@ApiTags('Posts')
@Controller('posts/:id/categories')
export class CategoriesOnPostsController {
  constructor(private readonly categoriesOnPostsService: CategoriesOnPostsService) {}

  @ApiCreatedResponse({
    description: 'The list of categories was successfully added to the post.',
    type: [PostCategoryEntity],
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
  @Post()
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to add the categories list',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  createPostCategories(
    @Param('id') postId: string,
    @Body(ValidationPipes.parseArrayPipe(PostCategoryEntity))
    postCategoriesList: PostCategoryEntity[],
  ) {
    return this.categoriesOnPostsService
      .createPostCategories(postId, postCategoriesList)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
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
  @Get()
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to find the categories list',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  findAllPostCategories(@Param('id') postId: string) {
    return this.categoriesOnPostsService
      .findAllPostCategories(postId)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'The list of categories of the post was successfully updated.',
    type: [PostCategoryEntity],
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
  @Put()
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to update the categories list',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  updatePostCategories(
    @Param('id') postId: string,
    @Body(ValidationPipes.parseArrayPipe(PostCategoryEntity))
    postCategoriesList: PostCategoryEntity[],
  ) {
    return this.categoriesOnPostsService
      .updatePostCategories(postId, postCategoriesList)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'The list of categories of the post was successfully removed.',
    type: [PostCategoryEntity],
  })
  @ApiNotFoundResponse({
    description: 'The post with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Delete()
  @ApiParam({
    name: 'id',
    description: 'The id of the post to delete the categories list',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  removePostCategories(
    @Param('id') postId: string,
    @Body(ValidationPipes.parseArrayPipe(PostCategoryEntity))
    postCategoriesList: PostCategoryEntity[],
  ) {
    return this.categoriesOnPostsService
      .removePostCategories(postId, postCategoriesList)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }
}
