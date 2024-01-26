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
import { throwHttpExceptionBasedOnErrorType } from 'src/core/error-handling/error-handler';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdatePostAttachmentDto } from './dto/update-post-attachment.dto';

@Controller('post-attachments')
export class PostAttachmentController {
  constructor(private readonly postAttachmentService: PostAttachmentService) {}

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.postAttachmentService
      .findById(id)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updatePostAttachmentDto: UpdatePostAttachmentDto,
  ) {
    return this.postAttachmentService
      .update(id, { ...updatePostAttachmentDto, file: file.buffer })
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postAttachmentService
      .remove(id)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }
}
