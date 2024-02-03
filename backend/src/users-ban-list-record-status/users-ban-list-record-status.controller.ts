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
import { UsersBanListRecordStatusService } from './users-ban-list-record-status.service';
import { UsersBanListRecordStatusEntity } from './entities/users-ban-list-record-status.entity';
import { CreateUsersBanListRecordStatusDto } from './dto/create-users-ban-list-record-status.dto';
import { UpdateUsersBanListRecordStatusDto } from './dto/update-users-ban-list-record-status.dto';

@ApiTags('Ban statuses')
@Controller('ban-statuses')
export class UsersBanListRecordStatusController {
  constructor(private readonly usersBanListRecordStatusService: UsersBanListRecordStatusService) {}

  @ApiCreatedResponse({
    description: 'Users ban list record status was successfully created.',
    type: UsersBanListRecordStatusEntity,
  })
  @ApiConflictResponse({
    description: 'Cannot create users ban list record status. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post()
  create(@Body() createUsersBanListRecordStatusDto: CreateUsersBanListRecordStatusDto) {
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
  findAll() {
    return this.usersBanListRecordStatusService.findAll();
  }

  @ApiOkResponse({
    description: 'Users ban list records status was successfully updated.',
    type: UsersBanListRecordStatusEntity,
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
  update(
    @Param('name') name: string,
    @Body() updateUsersBanListRecordStatusDto: UpdateUsersBanListRecordStatusDto,
  ) {
    return this.usersBanListRecordStatusService.update(name, updateUsersBanListRecordStatusDto);
  }

  @ApiOkResponse({
    description: 'Users ban list record status was successfully removed.',
    type: UsersBanListRecordStatusEntity,
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
  remove(@Param('name') name: string) {
    return this.usersBanListRecordStatusService.remove(name);
  }
}
