import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UsersBanListRecordEntity } from './entities/users-ban-list-record.entity';
import { UpdateUsersBanListRecordDto } from './dto/update-users-ban-list-record.dto';
import { UsersBanListRecordService } from './users-ban-list-record.service';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/user/types/user.types';

@ApiTags('Bans')
@Controller('bans')
export class UsersBanListRecordController {
  constructor(private readonly usersBanListRecordService: UsersBanListRecordService) {}

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'The list of users ban list records',
    type: [UsersBanListRecordEntity],
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get()
  async findAll() {
    return this.usersBanListRecordService.findAll();
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'The users ban list record with requested id',
    type: UsersBanListRecordEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The users ban list record with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the users ban list recod to be updated',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersBanListRecordService.findById(id);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_USER_BANS })
  @ApiOkResponse({
    description: 'Users ban list record was successfully updated.',
    type: UsersBanListRecordEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
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
  @ApiParam({
    name: 'id',
    description: 'The uuid of the user to be updated',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUsersBanListRecordDto: UpdateUsersBanListRecordDto,
  ) {
    return this.usersBanListRecordService.update(id, updateUsersBanListRecordDto);
  }

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_USER_BANS })
  @ApiOkResponse({
    description: 'Users ban list record was successfully removed.',
    type: UsersBanListRecordEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The users ban list record with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the users ban list record to be deleted',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersBanListRecordService.remove(id);
  }
}
