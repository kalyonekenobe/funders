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
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ChatMessageEntity } from './entities/chat-message.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadRestrictions } from 'src/core/decorators/upload-restrictions.decorator';
import { ChatMessageRequestBodyFiles } from './types/chat-message.types';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';

@Controller('messages')
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  @ApiOkResponse({
    description: 'The chat message with requested id',
    type: ChatMessageEntity,
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
  findById(@Param('id') id: string) {
    return this.chatMessageService.findById(id);
  }

  // @ApiOkResponse({
  //   description: 'The list of Chat message attachments',
  //   type: [PostCommentAttachmentEntity],
  // })
  // @ApiNotFoundResponse({
  //   description: 'The Chat message with specified id was not found.',
  // })
  // @ApiInternalServerErrorResponse({
  //   description: 'Internal server error was occured.',
  // })
  // @ApiParam({
  //   name: 'id',
  //   description: 'The uuid of the Chat message to be found',
  //   schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  // })
  // @Get(':id/attachments')
  // findAllPostCommentAttachments(@Param('id') id: string) {
  //   return this.postCommentAttachmentService.findAllForComment(id);
  // }

  @ApiOkResponse({
    description: 'Chat message was successfully updated.',
    type: ChatMessageEntity,
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
  update(
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

  @ApiOkResponse({
    description: 'Chat message was successfully removed.',
    type: ChatMessageEntity,
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
  remove(@Param('id') id: string) {
    return this.chatMessageService.remove(id);
  }
}
