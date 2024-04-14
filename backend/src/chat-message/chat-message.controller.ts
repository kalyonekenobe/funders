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
import { ChatMessageService } from './chat-message.service';
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
import { ChatMessageEntity } from './entities/chat-message.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadRestrictions } from 'src/core/decorators/upload-restrictions.decorator';
import { ChatMessageRequestBodyFiles } from './types/chat-message.types';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { ChatMessageAttachmentService } from 'src/chat-message-attachment/chat-message-attachment.service';
import { ChatMessageAttachmentEntity } from 'src/chat-message-attachment/entities/chat-message-attachment.entity';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/user/types/user.types';

@ApiTags('Chat messages')
@Controller('messages')
export class ChatMessageController {
  constructor(
    private readonly chatMessageService: ChatMessageService,
    private readonly chatMessageAttachmentService: ChatMessageAttachmentService,
  ) {}

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'The chat message with requested id',
    type: ChatMessageEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The chat message with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat message to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.chatMessageService.findById(id);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'The list of chat message attachments',
    type: [ChatMessageAttachmentEntity],
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The chat message with specified id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat message to be found',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/attachments')
  async findAllChatMessageAttachments(@Param('id') id: string) {
    return this.chatMessageAttachmentService.findAllForChatMessage(id);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_CHAT_MESSAGES })
  @ApiOkResponse({
    description: 'Chat message was successfully updated.',
    type: ChatMessageEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The chat message with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update chat message. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat message to be updated',
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
    files: ChatMessageRequestBodyFiles,
    @Param('id') id: string,
    @Body() updateChatMessageDto: UpdateChatMessageDto,
  ) {
    return this.chatMessageService.update(id, updateChatMessageDto, files);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_CHAT_MESSAGES })
  @ApiOkResponse({
    description: 'Chat message was successfully removed.',
    type: ChatMessageEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The chat message with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the chat message to be deleted',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.chatMessageService.remove(id);
  }
}
