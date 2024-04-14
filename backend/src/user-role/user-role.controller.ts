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
import { UserRoleService } from './user-role.service';
import { UserRoleEntity } from './entities/user-role.entity';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/user/types/user.types';

@ApiTags('User roles')
@Controller('user-roles')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

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
    description: 'User role was successfully created.',
    type: UserRoleEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiConflictResponse({
    description: 'Cannot create user role. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post()
  async create(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.userRoleService.create(createUserRoleDto);
  }

  @ApiOkResponse({
    description: 'The list of user roles',
    type: [UserRoleEntity],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get()
  async findAll() {
    return this.userRoleService.findAll();
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
    description: 'User role was successfully updated.',
    type: UserRoleEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The user role with the requested name was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update user role. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'name',
    description: 'The name of the user role to be updated',
    schema: { example: 'Administrator' },
  })
  @Put(':name')
  async update(@Param('name') name: string, @Body() updateUserRoleDto: UpdateUserRoleDto) {
    return this.userRoleService.update(name, updateUserRoleDto);
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
    description: 'User role was successfully removed.',
    type: UserRoleEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The user role with the requested name was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'name',
    description: 'The name of the user role to be deleted',
    schema: { example: 'Administrator' },
  })
  @Delete(':name')
  async remove(@Param('name') name: string) {
    return this.userRoleService.remove(name);
  }
}
