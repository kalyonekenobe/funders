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
import { UsersBanListRecordStatusService } from './users-ban-list-record-status.service';
import { UsersBanListRecordStatusEntity } from './entities/users-ban-list-record-status.entity';
import { CreateUsersBanListRecordStatusDto } from './dto/create-users-ban-list-record-status.dto';
import { UpdateUsersBanListRecordStatusDto } from './dto/update-users-ban-list-record-status.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/user/types/user.types';

@ApiTags('Ban statuses')
@Controller('ban-statuses')
export class UsersBanListRecordStatusController {
  constructor(private readonly usersBanListRecordStatusService: UsersBanListRecordStatusService) {}

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
    description: 'Users ban list record status was successfully created.',
    type: UsersBanListRecordStatusEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiConflictResponse({
    description: 'Cannot create users ban list record status. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post()
  async create(@Body() createUsersBanListRecordStatusDto: CreateUsersBanListRecordStatusDto) {
    return this.usersBanListRecordStatusService.create(createUsersBanListRecordStatusDto);
  }

  @ApiOkResponse({
    description: 'The list of users ban list record statuses',
    type: [UsersBanListRecordStatusEntity],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get()
  async findAll() {
    return this.usersBanListRecordStatusService.findAll();
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
    description: 'Users ban list records status was successfully updated.',
    type: UsersBanListRecordStatusEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The users ban list records status with the requested name was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update users ban list record status. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'name',
    description: 'The name of the users ban list record status to be updated',
    schema: { example: 'Permanent' },
  })
  @Put(':name')
  async update(
    @Param('name') name: string,
    @Body() updateUsersBanListRecordStatusDto: UpdateUsersBanListRecordStatusDto,
  ) {
    return this.usersBanListRecordStatusService.update(name, updateUsersBanListRecordStatusDto);
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
    description: 'Users ban list record status was successfully removed.',
    type: UsersBanListRecordStatusEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The users ban list record status with the requested name was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'name',
    description: 'The name of the users ban list record status to be deleted',
    schema: { example: 'Permanent' },
  })
  @Delete(':name')
  async remove(@Param('name') name: string) {
    return this.usersBanListRecordStatusService.remove(name);
  }
}
