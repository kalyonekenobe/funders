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
      .then(async response => {
        const resource = response as UploadApiResponse;
        const deprecatedResource = await this.postAttachmentService.findById(id);
        console.log(deprecatedResource);
        this.cloudinaryService
          .removeFiles([
            {
              resource_type: deprecatedResource.resourceType,
              public_id: deprecatedResource.file,
            },
          ])
          .catch(error => console.log(error));

        return this.postAttachmentService.update(id, {
          ...updatePostAttachmentDto,
          file: resource.public_id,
          resourceType: resource.resource_type,
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
          .removeFiles([{ resource_type: response.resourceType, public_id: response.file }])
          .catch(error => console.log(error));
        return response;
      })
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }
}
