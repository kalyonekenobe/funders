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
import { UserRegistrationMethodService } from './user-registration-method.service';
import { UserRegistrationMethodEntity } from './entities/user-registration-method.entity';
import { CreateUserRegistrationMethodDto } from './dto/create-user-registration-method.dto';
import { UpdateUserRegistrationMethodDto } from './dto/update-user-registration-method.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { Permissions } from 'src/user/types/user.types';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';

@ApiTags('User registration methods')
@Controller('user-registration-methods')
export class UserRegistrationMethodController {
  constructor(private readonly userRegistrationMethodService: UserRegistrationMethodService) {}

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
    description: 'User registration method was successfully created.',
    type: UserRegistrationMethodEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiConflictResponse({
    description: 'Cannot create user registration method. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post()
  async create(@Body() createUserRegistrationMethodDto: CreateUserRegistrationMethodDto) {
    return this.userRegistrationMethodService.create(createUserRegistrationMethodDto);
  }

  @ApiOkResponse({
    description: 'The list of user registration methods',
    type: [UserRegistrationMethodEntity],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get()
  async findAll() {
    return this.userRegistrationMethodService.findAll();
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
    description: 'User registration method was successfully updated.',
    type: UserRegistrationMethodEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The user registration method with requested name was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update user registration method. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'name',
    description: 'The name of the user registration method to be updated',
    schema: { example: 'Google' },
  })
  @Put(':name')
  async update(
    @Param('name') name: string,
    @Body() updateUserRegistrationMethodDto: UpdateUserRegistrationMethodDto,
  ) {
    return this.userRegistrationMethodService.update(name, updateUserRegistrationMethodDto);
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
    description: 'User registration method was successfully removed.',
    type: UserRegistrationMethodEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The user registration method with requested name was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'name',
    description: 'The name of the user registration method to be deleted',
    schema: { example: 'Google' },
  })
  @Delete(':name')
  async remove(@Param('name') name: string) {
    return this.userRegistrationMethodService.remove(name);
  }
}
