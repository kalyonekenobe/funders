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
import { UsersBanListRecordEntity } from './entities/users-ban-list-record.entity';
import { CreateUsersBanListRecordDto } from './dto/create-users-ban-list-record.dto';
import { throwHttpExceptionBasedOnErrorType } from 'src/core/error-handling/error-handler';
import { UpdateUsersBanListRecordDto } from './dto/update-users-ban-list-record.dto';
import { UsersBanListRecordService } from './users-ban-list-record.service';

@ApiTags('Users')
@Controller('users')
export class UsersBanListRecordController {
  constructor(private readonly usersBanListRecordService: UsersBanListRecordService) {}

  @ApiCreatedResponse({
    description: 'Users ban list record was successfully created.',
    type: UsersBanListRecordEntity,
  })
  @ApiConflictResponse({
    description: 'Cannot create users ban list record. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the user which should be banned',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Post(':id/bans')
  create(
    @Param('id') userId: string,
    @Body() createUsersBanListRecordDto: Omit<CreateUsersBanListRecordDto, 'userId'>,
  ) {
    return this.usersBanListRecordService
      .create({ ...createUsersBanListRecordDto, userId })
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'The list of users ban list records',
    type: [UsersBanListRecordEntity],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get('bans')
  findAll() {
    return this.usersBanListRecordService
      .findAll()
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: "The list of user's ban list records",
    type: [UsersBanListRecordEntity],
  })
  @ApiNotFoundResponse({
    description: 'The user with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the user to get his list of bans',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id/bans')
  findAllUserBans(@Param('id') userId: string) {
    return this.usersBanListRecordService
      .findAllUserBans(userId)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'The users ban list record with requested id',
    type: UsersBanListRecordEntity,
  })
  @ApiNotFoundResponse({
    description: 'The users ban list record with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get('bans/:id')
  @ApiParam({
    name: 'id',
    description: 'The uuid of the users ban list recod to be updated',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  findById(@Param('id') id: string) {
    return this.usersBanListRecordService
      .findById(id)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'Users ban list record was successfully updated.',
    type: UsersBanListRecordEntity,
  })
  @ApiNotFoundResponse({
    description: 'The users ban list record with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update users ban list record. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Put('bans/:id')
  @ApiParam({
    name: 'id',
    description: 'The uuid of the user to be updated',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  update(
    @Param('id') id: string,
    @Body() updateUsersBanListRecordDto: UpdateUsersBanListRecordDto,
  ) {
    return this.usersBanListRecordService
      .update(id, updateUsersBanListRecordDto)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'Users ban list record was successfully removed.',
    type: UsersBanListRecordEntity,
  })
  @ApiNotFoundResponse({
    description: 'The users ban list record with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Delete('bans/:id')
  @ApiParam({
    name: 'id',
    description: 'The id of the users ban list record to be deleted',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  remove(@Param('id') id: string) {
    return this.usersBanListRecordService
      .remove(id)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }
}
