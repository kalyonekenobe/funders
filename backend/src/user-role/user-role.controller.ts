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
import { UserRoleService } from './user-role.service';
import { UserRoleEntity } from './entities/user-role.entity';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { throwHttpExceptionBasedOnErrorType } from 'src/core/error-handling/error-handler';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('Users')
@Controller('users/roles')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @ApiCreatedResponse({
    description: 'User role was successfully created.',
    type: UserRoleEntity,
  })
  @ApiConflictResponse({
    description: 'Cannot create user role. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post()
  create(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.userRoleService
      .create(createUserRoleDto)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'The list of user roles',
    type: [UserRoleEntity],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get()
  findAll() {
    return this.userRoleService
      .findAll()
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'User role was successfully updated.',
    type: UserRoleEntity,
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
  @Put(':name')
  @ApiParam({
    name: 'name',
    description: 'The name of the user role to be updated',
    schema: { example: 'Administrator' },
  })
  update(@Param('name') name: string, @Body() updateUserRoleDto: UpdateUserRoleDto) {
    return this.userRoleService
      .update(name, updateUserRoleDto)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'User role was successfully removed.',
    type: UserRoleEntity,
  })
  @ApiNotFoundResponse({
    description: 'The user role with the requested name was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Delete(':name')
  @ApiParam({
    name: 'name',
    description: 'The name of the user role to be deleted',
    schema: { example: 'Administrator' },
  })
  remove(@Param('name') name: string) {
    return this.userRoleService
      .remove(name)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }
}
