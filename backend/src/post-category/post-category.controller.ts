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
import { PostCategoryService } from './post-category.service';
import { throwHttpExceptionBasedOnErrorType } from 'src/core/error-handling/error-handler';
import { PostCategoryEntity } from './entities/post-category.entity';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category.dto';

@ApiTags('Posts')
@Controller('posts/categories')
export class PostCategoryController {
  constructor(private readonly postCategoryService: PostCategoryService) {}

  @ApiCreatedResponse({
    description: 'Post category was successfully created.',
    type: PostCategoryEntity,
  })
  @ApiConflictResponse({
    description: 'Cannot create post category. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post()
  create(@Body() createPostCategoryDto: CreatePostCategoryDto) {
    return this.postCategoryService
      .create(createPostCategoryDto)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'The list of post categories',
    type: [PostCategoryEntity],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get()
  findAll() {
    return this.postCategoryService
      .findAll()
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'Post category was successfully updated.',
    type: PostCategoryEntity,
  })
  @ApiNotFoundResponse({
    description: 'The post category with requested name was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update post category. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Put(':name')
  @ApiParam({
    name: 'name',
    description: 'The name of the post category to be updated',
    schema: { example: 'Army' },
  })
  update(@Param('name') name: string, @Body() updatePostCategoryDto: UpdatePostCategoryDto) {
    return this.postCategoryService
      .update(name, updatePostCategoryDto)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'Post category was successfully removed.',
    type: PostCategoryEntity,
  })
  @ApiNotFoundResponse({
    description: 'The post category with requested name was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Delete(':name')
  @ApiParam({
    name: 'name',
    description: 'The name of the post category to be deleted',
    schema: { example: 'Army' },
  })
  remove(@Param('name') name: string) {
    return this.postCategoryService
      .remove(name)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }
}
