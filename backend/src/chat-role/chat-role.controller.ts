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
import { ChatRoleService } from './chat-role.service';
import { ChatRoleEntity } from './entities/chat-role.entity';
import { CreateChatRoleDto } from './dto/create-chat-role.dto';
import { UpdateChatRoleDto } from './dto/update-chat-role.dto';

@ApiTags('Chat roles')
@Controller('chat-roles')
export class ChatRoleController {
  constructor(private readonly chatRoleService: ChatRoleService) {}

  @ApiCreatedResponse({
    description: 'Chat role was successfully created.',
    type: ChatRoleEntity,
  })
  @ApiConflictResponse({
    description: 'Cannot create chat role. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post()
  create(@Body() createChatRoleDto: CreateChatRoleDto) {
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
  findAll() {
    return this.chatRoleService.findAll();
  }

  @ApiOkResponse({
    description: 'Chat role was successfully updated.',
    type: ChatRoleEntity,
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
  @Put(':name')
  @ApiParam({
    name: 'name',
    description: 'The name of the chat role to be updated',
    schema: { example: 'Owner' },
  })
  update(@Param('name') name: string, @Body() updateChatRoleDto: UpdateChatRoleDto) {
    return this.chatRoleService.update(name, updateChatRoleDto);
  }

  @ApiOkResponse({
    description: 'Chat role was successfully removed.',
    type: ChatRoleEntity,
  })
  @ApiNotFoundResponse({
    description: 'The chat role with requested name was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Delete(':name')
  @ApiParam({
    name: 'name',
    description: 'The name of the chat role to be deleted',
    schema: { example: 'Owner' },
  })
  remove(@Param('name') name: string) {
    return this.chatRoleService.remove(name);
  }
}
