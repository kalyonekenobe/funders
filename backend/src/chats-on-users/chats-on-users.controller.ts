import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ChatsOnUsersService } from './chats-on-users.service';
import { ChatsOnUsersEntity } from './entities/chats-on-users.entity';
import { CreateChatsOnUsersDto } from './dto/create-chats-on-users.dto';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';
import { UpdateChatsOnUsersDto } from './dto/update-chats-on-users.dto';

@ApiTags('Posts')
@Controller('chats/:chatId/users')
export class ChatsOnUsersController {
  constructor(private readonly chatsOnUsersService: ChatsOnUsersService) {}

  @ApiCreatedResponse({
    description: 'The user was successfully added to the chat.',
    type: ChatsOnUsersEntity,
  })
  @ApiNotFoundResponse({
    description: 'The chat with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot add the user to the chat. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'chatId',
    description: 'The uuid of the chat to add the user',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Post()
  createPostCategories(
    @Param('chatId') chatId: string,
    @Body()
    createChatsOnUsersDto: CreateChatsOnUsersDto,
  ) {
    return this.chatsOnUsersService.create(chatId, createChatsOnUsersDto);
  }

  @ApiOkResponse({
    description: 'The list of users of the chat',
    type: [UserPublicEntity],
  })
  @ApiNotFoundResponse({
    description: 'Cannot find chat with the specified id.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'chatId',
    description: 'The uuid of the chat to find the users',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get()
  findAllPostCategories(@Param('chatId') chatId: string) {
    return this.chatsOnUsersService.findAllUsersForChat(chatId);
  }

  @ApiOkResponse({
    description: 'The user of the chat was successfully updated.',
    type: ChatsOnUsersEntity,
  })
  @ApiNotFoundResponse({
    description: 'The chat or the user with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update the user of the chat. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'chatId',
    description: 'The uuid of the chat to update the user',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiParam({
    name: 'userId',
    description: 'The uuid of the user to update the user in chat',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Put(':userId')
  updatePostCategories(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
    @Body()
    updateChatsOnUsersDto: UpdateChatsOnUsersDto,
  ) {
    return this.chatsOnUsersService.update(chatId, userId, updateChatsOnUsersDto);
  }

  @ApiOkResponse({
    description: 'The user of the chat was successfully removed.',
    type: ChatsOnUsersEntity,
  })
  @ApiNotFoundResponse({
    description: 'The chat or the user with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'chatId',
    description: 'The id of the chat to delete the user',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiParam({
    name: 'userId',
    description: 'The id of the user to delete the user in chat',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':userId')
  removePostCategories(@Param('chatId') chatId: string, @Param('userId') userId: string) {
    return this.chatsOnUsersService.remove(chatId, userId);
  }
}
