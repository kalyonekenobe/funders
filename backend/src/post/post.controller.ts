import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { throwHttpExceptionBasedOnErrorType } from 'src/core/error-handling/error-handler';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostAttachmentService } from 'src/post-attachment/post-attachment.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PostRequestBodyFiles } from './post.types';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postAttachmentService: PostAttachmentService,
  ) {}

  @ApiCreatedResponse({
    description: 'Post was successfully created.',
    type: [PostEntity],
  })
  @ApiConflictResponse({
    description: 'Cannot create post. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'attachments' }, { name: 'image', maxCount: 1 }]))
  create(@UploadedFiles() files: PostRequestBodyFiles, @Body() createPostDto: CreatePostDto) {
    return this.postService
      .create(createPostDto, files)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'The list of posts',
    type: [PostEntity],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get()
  findAll() {
    return this.postService
      .findAll()
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'The post with requested id',
    type: PostEntity,
  })
  @ApiNotFoundResponse({
    description: 'The post with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be updated',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  findById(@Param('id') id: string) {
    return this.postService
      .findById(id)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @Get(':id/attachments')
  findAllPostAttachments(@Param('id') id: string) {
    return this.postAttachmentService
      .findAllForPost(id)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'Post was successfully updated.',
    type: PostEntity,
  })
  @ApiNotFoundResponse({
    description: 'The post with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update post. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Put(':id')
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be updated',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'attachments' }, { name: 'image', maxCount: 1 }]))
  update(
    @UploadedFiles() files: PostRequestBodyFiles,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService
      .update(id, updatePostDto, files)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'Post was successfully removed.',
    type: PostEntity,
  })
  @ApiNotFoundResponse({
    description: 'The post with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'The id of the post to be deleted',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  remove(@Param('id') id: string) {
    return this.postService
      .remove(id)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }
}
