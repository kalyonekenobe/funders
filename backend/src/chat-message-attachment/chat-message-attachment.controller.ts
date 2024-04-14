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
import { ChatMessageAttachmentService } from './chat-message-attachment.service';
import { ChatMessageAttachmentEntity } from './entities/chat-message-attachment.entity';
import { UpdateChatMessageAttachmentDto } from './dto/update-chat-message-attachment.dto';
import { UploadRestrictions } from 'src/core/decorators/upload-restrictions.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/user/types/user.types';

@ApiTags('Chat message attachments')
@Controller('message-attachments')
export class ChatMessageAttachmentController {
  constructor(private readonly chatMessageAttachmentService: ChatMessageAttachmentService) {}

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'The chat message attachment with requested id',
    type: ChatMessageAttachmentEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The chat message attachment with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat message attachment to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.chatMessageAttachmentService.findById(id);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_CHAT_MESSAGES })
  @ApiOkResponse({
    description: 'Chat message attachment was successfully updated.',
    type: ChatMessageAttachmentEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The chat message attachment with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update chat message attachment. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat message attachment to be updated',
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
    @Body() updateChatMessageAttachmentDto: Omit<UpdateChatMessageAttachmentDto, 'file'>,
  ) {
    return this.chatMessageAttachmentService.update(
      id,
      updateChatMessageAttachmentDto,
      files?.file?.[0],
    );
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_CHAT_MESSAGES })
  @ApiOkResponse({
    description: 'Chat message attachment was successfully removed.',
    type: ChatMessageAttachmentEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The chat message attachment with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the chat message attachment to be deleted',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.chatMessageAttachmentService.remove(id);
  }
}
