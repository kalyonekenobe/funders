import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserReactionTypeService } from './user-reaction-type.service';
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
import { UserReactionTypeEntity } from './entities/user-reaction-type.entity';
import { UpdateUserReactionTypeDto } from './dto/update-user-reaction-type.dto';
import { CreateUserReactionTypeDto } from './dto/create-user-reaction-type.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/user/types/user.types';

@ApiTags('User reaction types')
@Controller('user-reaction-types')
export class UserReactionTypeController {
  constructor(private readonly userReactionTypeService: UserReactionTypeService) {}

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
    description: 'User reaction type was successfully created.',
    type: UserReactionTypeEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiConflictResponse({
    description: 'Cannot create user reaction type. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post()
  async create(@Body() createUserReactionTypeDto: CreateUserReactionTypeDto) {
    return this.userReactionTypeService.create(createUserReactionTypeDto);
  }

  @ApiOkResponse({
    description: 'The list of user reaction types',
    type: [UserReactionTypeEntity],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get()
  async findAll() {
    return this.userReactionTypeService.findAll();
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
    description: 'User reaction type was successfully updated.',
    type: UserReactionTypeEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The user reaction type with requested name was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update user reaction type. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'name',
    description: 'The name of the user reaction type to be updated',
    schema: { example: 'Like' },
  })
  @Put(':name')
  async update(
    @Param('name') name: string,
    @Body() updateUserReactionTypeDto: UpdateUserReactionTypeDto,
  ) {
    return this.userReactionTypeService.update(name, updateUserReactionTypeDto);
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
    description: 'User reaction type was successfully removed.',
    type: UserReactionTypeEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The user reaction type with requested name was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'name',
    description: 'The name of the user reaction type to be deleted',
    schema: { example: 'Like' },
  })
  @Delete(':name')
  async remove(@Param('name') name: string) {
    return this.userReactionTypeService.remove(name);
  }
}
