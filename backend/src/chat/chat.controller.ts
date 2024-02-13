import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatEntity } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatMessageService } from 'src/chat-message/chat-message.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ChatMessageEntity } from 'src/chat-message/entities/chat-message.entity';
import { UploadRestrictions } from 'src/core/decorators/upload-restrictions.decorator';
import { ChatMessageRequestBodyFiles } from 'src/chat-message/types/chat-message.types';
import { CreateChatMessageDto } from 'src/chat-message/dto/create-chat-message.dto';

@ApiTags('Chats')
@Controller('chats')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  @ApiCreatedResponse({
    description: 'Chat was successfully created.',
    type: ChatEntity,
  })
  @ApiConflictResponse({
    description: 'Cannot create chat. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @ApiCreatedResponse({
    description: 'Chat message was successfully created.',
    type: ChatMessageEntity,
  })
  @ApiNotFoundResponse({
    description: 'The chat with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot create chat message. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'attachments' }]))
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Post(':id/messages')
  createMessage(
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
    @Body() createChatMessageDto: CreateChatMessageDto,
  ) {
    return this.chatMessageService.create(id, createChatMessageDto, files);
  }

  @ApiOkResponse({
    description: 'The list of chat messages',
    type: [ChatMessageEntity],
  })
  @ApiNotFoundResponse({
    description: 'The chat with specified id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat to be found',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/messages')
  findAllChatMessages(@Param('id') id: string) {
    return this.chatMessageService.findAllForChat(id);
  }

  @ApiOkResponse({
    description: 'The list of chats',
    type: [ChatEntity],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @ApiOkResponse({
    description: 'The chat with requested id',
    type: ChatEntity,
  })
  @ApiNotFoundResponse({
    description: 'The chat with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat to be updated',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.chatService.findById(id);
  }

  @ApiOkResponse({
    description: 'Chat was successfully updated.',
    type: ChatEntity,
  })
  @ApiNotFoundResponse({
    description: 'The chat with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update chat. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the chat to be updated',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(id, updateChatDto);
  }

  @ApiOkResponse({
    description: 'Chat was successfully removed.',
    type: ChatEntity,
  })
  @ApiNotFoundResponse({
    description: 'The chat with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the chat to be deleted',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(id);
  }
}
