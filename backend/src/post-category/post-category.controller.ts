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
import { PostCategoryService } from './post-category.service';
import { PostCategoryEntity } from './entities/post-category.entity';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/user/types/user.types';

@ApiTags('Post categories')
@Controller('post-categories')
export class PostCategoryController {
  constructor(private readonly postCategoryService: PostCategoryService) {}

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_POST_CATEGORIES })
  @ApiCreatedResponse({
    description: 'Post category was successfully created.',
    type: PostCategoryEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiConflictResponse({
    description: 'Cannot create post category. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post()
  async create(@Body() createPostCategoryDto: CreatePostCategoryDto) {
    return this.postCategoryService.create(createPostCategoryDto);
  }

  @ApiOkResponse({
    description: 'The list of post categories',
    type: [PostCategoryEntity],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get()
  async findAll() {
    return this.postCategoryService.findAll();
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_POST_CATEGORIES })
  @ApiOkResponse({
    description: 'Post category was successfully updated.',
    type: PostCategoryEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
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
  @ApiParam({
    name: 'name',
    description: 'The name of the post category to be updated',
    schema: { example: 'Army' },
  })
  @Put(':name')
  async update(@Param('name') name: string, @Body() updatePostCategoryDto: UpdatePostCategoryDto) {
    return this.postCategoryService.update(name, updatePostCategoryDto);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_POST_CATEGORIES })
  @ApiOkResponse({
    description: 'Post category was successfully removed.',
    type: PostCategoryEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The post category with requested name was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'name',
    description: 'The name of the post category to be deleted',
    schema: { example: 'Army' },
  })
  @Delete(':name')
  async remove(@Param('name') name: string) {
    return this.postCategoryService.remove(name);
  }
}
