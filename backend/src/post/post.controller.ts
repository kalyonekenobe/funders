import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostAttachmentService } from 'src/post-attachment/post-attachment.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PostRequestBodyFiles } from './types/post.types';
import { PostAttachmentEntity } from 'src/post-attachment/entities/post-attachment.entity';
import { UploadRestrictions } from 'src/core/decorators/upload-restrictions.decorator';
import { UploadResourceTypes } from 'src/core/constants/constants';
import { PostDonationService } from 'src/post-donation/post-donation.service';
import { PostDonationEntity } from 'src/post-donation/entities/post-donation.entity';
import { CreatePostDonationDto } from 'src/post-donation/dto/create-post-donation.dto';
import { PostCommentService } from 'src/post-comment/post-comment.service';
import { PostCommentEntity } from 'src/post-comment/entities/post-comment.entity';
import { PostCommentRequestBodyFiles } from 'src/post-comment/types/post-comment.types';
import { CreatePostCommentDto } from 'src/post-comment/dto/create-post-comment.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/user/types/user.types';
import * as qs from 'qs';
import { parseObjectStringValuesToPrimitives } from 'src/core/utils/object.utils';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postDonationService: PostDonationService,
    private readonly postAttachmentService: PostAttachmentService,
    private readonly postCommentService: PostCommentService,
  ) {}

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_POSTS })
  @ApiCreatedResponse({
    description: 'Post was successfully created.',
    type: PostEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiConflictResponse({
    description: 'Cannot create post. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'attachments' }, { name: 'image', maxCount: 1 }]))
  @Post()
  async create(
    @UploadedFiles()
    @UploadRestrictions([
      {
        fieldname: 'image',
        minFileSize: 1,
        maxFileSize: 1024 * 1024 * 5,
        allowedMimeTypes: UploadResourceTypes.IMAGE,
      },
      {
        fieldname: 'attachments',
        minFileSize: 1,
        maxFileSize: 1024 * 1024 * 50,
      },
    ])
    files: PostRequestBodyFiles,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.create(createPostDto, files);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_POST_COMMENTS })
  @ApiCreatedResponse({
    description: 'Post comment was successfully created.',
    type: PostEntity,
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
    description: 'Cannot create post comment. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'attachments' }]))
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Post(':id/comments')
  async createComment(
    @UploadedFiles()
    @UploadRestrictions([
      {
        fieldname: 'attachments',
        minFileSize: 1,
        maxFileSize: 1024 * 1024 * 50,
      },
    ])
    files: PostCommentRequestBodyFiles,
    @Param('id') id: string,
    @Body() createPostCommentDto: CreatePostCommentDto,
  ) {
    return this.postCommentService.create(id, createPostCommentDto, files);
  }

  @ApiCreatedResponse({
    description: 'Post donation was successfully created.',
    type: PostDonationEntity,
  })
  @ApiNotFoundResponse({
    description: 'The post with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot create post donation. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Post(':id/donations')
  async createDonation(
    @Param('id') id: string,
    @Body() createPostDonationDto: CreatePostDonationDto,
  ) {
    return this.postDonationService.create(id, createPostDonationDto);
  }

  @ApiOkResponse({
    description: 'The list of posts',
    type: [PostEntity],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get()
  async findAll(@Query() query?: string) {
    return this.postService.findAll(
      query
        ? parseObjectStringValuesToPrimitives(qs.parse(query, { comma: true, allowDots: true }))
        : undefined,
    );
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
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id')
  async findById(@Param('id') id: string, @Query() query?: string) {
    return this.postService.findById(
      id,
      query
        ? parseObjectStringValuesToPrimitives(qs.parse(query, { comma: true, allowDots: true }))
        : undefined,
    );
  }

  @ApiOkResponse({
    description: 'The list of post attachments',
    type: [PostAttachmentEntity],
  })
  @ApiNotFoundResponse({
    description: 'The post with specified id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be found',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/attachments')
  async findAllPostAttachments(@Param('id') id: string) {
    return this.postAttachmentService.findAllForPost(id);
  }

  @ApiOkResponse({
    description: 'The list of post donations',
    type: [PostDonationEntity],
  })
  @ApiNotFoundResponse({
    description: 'The post with specified id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be found',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/donations')
  async findAllPostDonations(@Param('id') id: string) {
    return this.postDonationService.findAllForPost(id);
  }

  @ApiOkResponse({
    description: 'The list of post comments',
    type: [PostCommentEntity],
  })
  @ApiNotFoundResponse({
    description: 'The post with specified id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be found',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/comments')
  async findAllPostComments(@Param('id') id: string) {
    return this.postCommentService.findAllForPost(id);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_POSTS })
  @ApiOkResponse({
    description: 'Post was successfully updated.',
    type: PostEntity,
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
    description: 'Cannot update post. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be updated',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'attachments' }, { name: 'image', maxCount: 1 }]))
  @Put(':id')
  async update(
    @UploadedFiles()
    @UploadRestrictions([
      {
        fieldname: 'image',
        minFileSize: 1,
        maxFileSize: 1024 * 1024 * 5,
        allowedMimeTypes: UploadResourceTypes.IMAGE,
      },
      {
        fieldname: 'attachments',
        minFileSize: 1,
        maxFileSize: 1024 * 1024 * 50,
      },
    ])
    files: PostRequestBodyFiles,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto, files);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_POSTS })
  @ApiOkResponse({
    description: 'Post was successfully removed.',
    type: PostEntity,
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
    description: 'The id of the post to be deleted',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
