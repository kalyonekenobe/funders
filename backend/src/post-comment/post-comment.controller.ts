import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PostCommentService } from './post-comment.service';
import { PostCommentEntity } from './entities/post-comment.entity';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import { PostCommentRequestBodyFiles } from './types/post-comment.types';
import { UploadRestrictions } from 'src/core/decorators/upload-restrictions.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PostCommentAttachmentService } from 'src/post-comment-attachment/post-comment-attachment.service';

@ApiTags('Post comments')
@Controller('comments')
export class PostCommentController {
  constructor(
    private readonly postCommentService: PostCommentService,
    private readonly postCommentAttachmentService: PostCommentAttachmentService,
  ) {}

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.postCommentService.findById(id);
  }

  @ApiOkResponse({
    description: 'Post comment was successfully updated.',
    type: PostCommentEntity,
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
  update(
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
  ) {
    return this.postCommentService.update(id, updatePostCommentDto, files);
  }

  @ApiOkResponse({
    description: 'Post comment was successfully removed.',
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
    description: 'The id of the post comment to be deleted',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postCommentService.remove(id);
  }
}
