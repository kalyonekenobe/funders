import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostCommentService } from './post-comment.service';
import { PostCommentEntity } from './entities/post-comment.entity';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import { PostCommentRequestBodyFiles } from './types/post-comment.types';
import { UploadRestrictions } from 'src/core/decorators/upload-restrictions.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PostCommentAttachmentService } from 'src/post-comment-attachment/post-comment-attachment.service';
import { PostCommentAttachmentEntity } from 'src/post-comment-attachment/entities/post-comment-attachment.entity';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/user/types/user.types';
import { parseObjectStringValuesToPrimitives } from 'src/core/utils/object.utils';
import * as qs from 'qs';

@ApiTags('Post comments')
@Controller('comments')
export class PostCommentController {
  constructor(
    private readonly postCommentService: PostCommentService,
    private readonly postCommentAttachmentService: PostCommentAttachmentService,
  ) {}

  @ApiOkResponse({
    description: 'The post comment with requested id',
    type: PostCommentEntity,
  })
  @ApiNotFoundResponse({
    description: 'The post comment with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post comment to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.postCommentService.findById(id);
  }

  @ApiOkResponse({
    description: 'The list of post comment attachments',
    type: [PostCommentAttachmentEntity],
  })
  @ApiNotFoundResponse({
    description: 'The post comment with specified id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post comment to be found',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/attachments')
  async findAllPostCommentAttachments(@Param('id') id: string) {
    return this.postCommentAttachmentService.findAllForComment(id);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_POST_COMMENTS })
  @ApiOkResponse({
    description: 'Post comment was successfully updated.',
    type: PostCommentEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The post comment with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update post comment. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post comment to be updated',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'attachments' }]))
  @Put(':id')
  async update(
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
    @Body() updatePostCommentDto: UpdatePostCommentDto,
    @Query() query?: string,
  ) {
    return this.postCommentService.update(
      id,
      updatePostCommentDto,
      files,
      query
        ? parseObjectStringValuesToPrimitives(qs.parse(query, { comma: true, allowDots: true }))
        : undefined,
    );
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_POST_COMMENTS })
  @ApiOkResponse({
    description: 'Post comment was successfully removed.',
    type: PostCommentEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The post comment with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the post comment to be deleted',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.postCommentService.remove(id);
  }
}
