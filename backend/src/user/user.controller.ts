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
import { UserService } from './user.service';
import { UserPublicEntity } from './entities/user-public.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { throwHttpExceptionBasedOnErrorType } from 'src/core/error-handling/error-handler';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({
    description: 'User was successfully created.',
    type: UserPublicEntity,
  })
  @ApiConflictResponse({
    description: 'Cannot create user. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService
      .create(createUserDto)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'The list of users',
    type: [UserPublicEntity],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get()
  findAll() {
    return this.userService
      .findAll()
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'The user with requested id',
    type: UserPublicEntity,
  })
  @ApiNotFoundResponse({
    description: 'The user with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'The uuid of the user to be updated',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  findByPk(@Param('id') id: string) {
    return this.userService
      .findByPk(id)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'User was successfully updated.',
    type: UserPublicEntity,
  })
  @ApiNotFoundResponse({
    description: 'The user with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Put(':id')
  @ApiParam({
    name: 'id',
    description: 'The uuid of the user to be updated',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService
      .update(id, updateUserDto)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'User was successfully removed.',
    type: UserPublicEntity,
  })
  @ApiNotFoundResponse({
    description: 'The user with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'The id of the user to be deleted',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  remove(@Param('id') id: string) {
    return this.userService
      .remove(id)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }
}
