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
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostCommentAttachmentService } from './post-comment-attachment.service';
import { PostCommentAttachmentEntity } from './entities/post-comment-attachment.entity';
import { UpdatePostCommentAttachmentDto } from './dto/update-post-comment-attachment.dto';
import { UploadRestrictions } from 'src/core/decorators/upload-restrictions.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/user/types/user.types';

@ApiTags('Post comment attachments')
@Controller('comment-attachments')
export class PostCommentAttachmentController {
  constructor(private readonly postCommentAttachmentService: PostCommentAttachmentService) {}

  @ApiOkResponse({
    description: 'The post comment attachment with requested id',
    type: PostCommentAttachmentEntity,
  })
  @ApiNotFoundResponse({
    description: 'The post comment attachment with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post comment attachment to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.postCommentAttachmentService.findById(id);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_POST_COMMENTS })
  @ApiOkResponse({
    description: 'Post comment attachment was successfully updated.',
    type: PostCommentAttachmentEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The post comment attachment with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update post comment attachment. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post comment attachment to be updated',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 1 }]))
  @Put(':id')
  async update(
    @UploadedFiles()
    @UploadRestrictions([
      {
        fieldname: 'file',
        minFileSize: 1,
        maxFileSize: 1024 * 1024 * 50,
      },
    ])
    files: { file?: Express.Multer.File[] },
    @Param('id') id: string,
    @Body() updatePostCommentAttachmentDto: Omit<UpdatePostCommentAttachmentDto, 'file'>,
  ) {
    return this.postCommentAttachmentService.update(
      id,
      updatePostCommentAttachmentDto,
      files?.file?.[0],
    );
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_POST_COMMENTS })
  @ApiOkResponse({
    description: 'Post comment attachment was successfully removed.',
    type: PostCommentAttachmentEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The post comment attachment with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the post comment attachment to be deleted',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.postCommentAttachmentService.remove(id);
  }
}
