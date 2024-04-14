import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ChatsOnUsersService } from './chats-on-users.service';
import { ChatsOnUsersEntity } from './entities/chats-on-users.entity';
import { CreateChatsOnUsersDto } from './dto/create-chats-on-users.dto';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';
import { UpdateChatsOnUsersDto } from './dto/update-chats-on-users.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/user/types/user.types';

@ApiTags('Posts')
@Controller('chats/:chatId/users')
export class ChatsOnUsersController {
  constructor(private readonly chatsOnUsersService: ChatsOnUsersService) {}

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_CHATS })
  @ApiCreatedResponse({
    description: 'The user was successfully added to the chat.',
    type: ChatsOnUsersEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
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
  async create(
    @Param('chatId') chatId: string,
    @Body()
    createChatsOnUsersDto: CreateChatsOnUsersDto,
  ) {
    return this.chatsOnUsersService.create(chatId, createChatsOnUsersDto);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'The list of users of the chat',
    type: [UserPublicEntity],
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
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
  async findAllUsersForChat(@Param('chatId') chatId: string) {
    return this.chatsOnUsersService.findAllUsersForChat(chatId);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'The chats on users entity',
    type: ChatsOnUsersEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'Cannot find chat with the specified id.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'chatId',
    description: 'The uuid of the chat to find the user',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiParam({
    name: 'userId',
    description: 'The uuid of the user to find the user in chat',
    schema: { example: 'b7af9cd4-5533-4737-862b-78bce985c987' },
  })
  @Get(':userId')
  async findById(@Param('chatId') chatId: string, @Param('userId') userId: string) {
    return this.chatsOnUsersService.findById(chatId, userId);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_CHATS })
  @ApiOkResponse({
    description: 'The user of the chat was successfully updated.',
    type: ChatsOnUsersEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
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
    schema: { example: 'b7af9cd4-5533-4737-862b-78bce985c987' },
  })
  @Put(':userId')
  async update(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
    @Body()
    updateChatsOnUsersDto: UpdateChatsOnUsersDto,
  ) {
    return this.chatsOnUsersService.update(chatId, userId, updateChatsOnUsersDto);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_CHATS })
  @ApiOkResponse({
    description: 'The user of the chat was successfully removed.',
    type: ChatsOnUsersEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
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
    schema: { example: 'b7af9cd4-5533-4737-862b-78bce985c987' },
  })
  @Delete(':userId')
  async remove(@Param('chatId') chatId: string, @Param('userId') userId: string) {
    return this.chatsOnUsersService.remove(chatId, userId);
  }
}
