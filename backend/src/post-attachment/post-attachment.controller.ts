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
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';

@Controller('post-attachments')
export class PostAttachmentController {
  constructor(
    private readonly postAttachmentService: PostAttachmentService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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
    @Body() updatePostAttachmentDto: Omit<UpdatePostAttachmentDto, 'file'>,
  ) {
    return this.cloudinaryService
      .uploadFile(file, { folder: 'post_attachments' })
      .then(response => {
        const resourse = response as UploadApiResponse;
        this.postAttachmentService.findById(id).then(deprecatedResourse => {
          console.log(deprecatedResourse);
          return this.cloudinaryService
            .removeFiles([
              {
                resourse_type: deprecatedResourse.resourseType,
                public_id: deprecatedResourse.file,
              },
            ])
            .catch(error => console.log(error));
        });

        return this.postAttachmentService.update(id, {
          ...updatePostAttachmentDto,
          file: resourse.public_id,
          resourseType: resourse.resource_type,
        });
      })
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postAttachmentService
      .remove(id)
      .then(response => {
        this.cloudinaryService
          .removeFiles([{ resourse_type: response.resourseType, public_id: response.file }])
          .catch(error => console.log(error));
        return response;
      })
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }
}
