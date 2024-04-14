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
import { ChatRoleService } from './chat-role.service';
import { ChatRoleEntity } from './entities/chat-role.entity';
import { CreateChatRoleDto } from './dto/create-chat-role.dto';
import { UpdateChatRoleDto } from './dto/update-chat-role.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/user/types/user.types';

@ApiTags('Chat roles')
@Controller('chat-roles')
export class ChatRoleController {
  constructor(private readonly chatRoleService: ChatRoleService) {}

  @Auth(JwtAuthGuard, {
    permissions:
      Permissions.MANAGE_POST_COMMENTS |
      Permissions.MANAGE_CHATS |
      Permissions.MANAGE_CHAT_MESSAGES |
      Permissions.MANAGE_POSTS |
      Permissions.MANAGE_POST_CATEGORIES |
      Permissions.MANAGE_USERS |
      Permissions.MANAGE_USER_BANS,
  })
  @ApiCreatedResponse({
    description: 'Chat role was successfully created.',
    type: ChatRoleEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiConflictResponse({
    description: 'Cannot create chat role. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post()
  async create(@Body() createChatRoleDto: CreateChatRoleDto) {
    return this.chatRoleService.create(createChatRoleDto);
  }

  @ApiOkResponse({
    description: 'The list of chat roles',
    type: [ChatRoleEntity],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get()
  async findAll() {
    return this.chatRoleService.findAll();
  }

  @Auth(JwtAuthGuard, {
    permissions:
      Permissions.MANAGE_POST_COMMENTS |
      Permissions.MANAGE_CHATS |
      Permissions.MANAGE_CHAT_MESSAGES |
      Permissions.MANAGE_POSTS |
      Permissions.MANAGE_POST_CATEGORIES |
      Permissions.MANAGE_USERS |
      Permissions.MANAGE_USER_BANS,
  })
  @ApiOkResponse({
    description: 'Chat role was successfully updated.',
    type: ChatRoleEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The chat role with requested name was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update chat role. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'name',
    description: 'The name of the chat role to be updated',
    schema: { example: 'Owner' },
  })
  @Put(':name')
  async update(@Param('name') name: string, @Body() updateChatRoleDto: UpdateChatRoleDto) {
    return this.chatRoleService.update(name, updateChatRoleDto);
  }

  @Auth(JwtAuthGuard, {
    permissions:
      Permissions.MANAGE_POST_COMMENTS |
      Permissions.MANAGE_CHATS |
      Permissions.MANAGE_CHAT_MESSAGES |
      Permissions.MANAGE_POSTS |
      Permissions.MANAGE_POST_CATEGORIES |
      Permissions.MANAGE_USERS |
      Permissions.MANAGE_USER_BANS,
  })
  @ApiOkResponse({
    description: 'Chat role was successfully removed.',
    type: ChatRoleEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The chat role with requested name was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'name',
    description: 'The name of the chat role to be deleted',
    schema: { example: 'Owner' },
  })
  @Delete(':name')
  async remove(@Param('name') name: string) {
    return this.chatRoleService.remove(name);
  }
}
