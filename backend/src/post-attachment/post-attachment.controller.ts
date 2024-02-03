import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostAttachmentService } from './post-attachment.service';
import { UpdatePostAttachmentDto } from './dto/update-post-attachment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConflictResponse,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PostAttachmentEntity } from './entities/post-attachment.entity';

@ApiTags('Post attachments')
@Controller('post-attachments')
export class PostAttachmentController {
  constructor(private readonly postAttachmentService: PostAttachmentService) {}

  @ApiOkResponse({
    description: 'The post attachment with requested id',
    type: PostAttachmentEntity,
  })
  @ApiNotFoundResponse({
    description: 'The post attachment with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post attachment to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.postAttachmentService.findById(id);
  }

  @ApiOkResponse({
    description: 'Post attachment was successfully updated.',
    type: PostAttachmentEntity,
  })
  @ApiNotFoundResponse({
    description: 'The post attachment with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update post attachment. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post attachment to be updated',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Put(':id')
  update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updatePostAttachmentDto: Omit<UpdatePostAttachmentDto, 'file'>,
  ) {
    return this.postAttachmentService.update(id, updatePostAttachmentDto, file);
  }

  @ApiOkResponse({
    description: 'Post attachment was successfully removed.',
    type: PostAttachmentEntity,
  })
  @ApiNotFoundResponse({
    description: 'The post attachment with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the post attachment to be deleted',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postAttachmentService.remove(id);
  }
}
