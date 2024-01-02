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
import { UserRegistrationMethodService } from './user-registration-method.service';
import { UserRegistrationMethodEntity } from './entities/user-registration-method.entity';
import { CreateUserRegistrationMethodDto } from './dto/create-user-registration-method.dto';
import { UpdateUserRegistrationMethodDto } from './dto/update-user-registration-method.dto';
import { throwHttpExceptionBasedOnErrorType } from 'src/core/error-handling/error-handler';

@ApiTags('User registration methods')
@Controller('user-registration-methods')
export class UserRegistrationMethodController {
  constructor(private readonly userRegistrationMethodService: UserRegistrationMethodService) {}

  @ApiCreatedResponse({
    description: 'User registration method was successfully created.',
    type: UserRegistrationMethodEntity,
  })
  @ApiConflictResponse({
    description: 'Cannot create user registration method. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post()
  create(@Body() createUserRegistrationMethodDto: CreateUserRegistrationMethodDto) {
    return this.userRegistrationMethodService
      .create(createUserRegistrationMethodDto)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'The list of user registration methods',
    type: [UserRegistrationMethodEntity],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get()
  findAll() {
    return this.userRegistrationMethodService
      .findAll()
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'The list of users registered with requested user registration method.',
    //type: [UserEntity],
  })
  @ApiNotFoundResponse({
    description: 'The user registration method with requested name was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get(':name/users')
  @ApiParam({
    name: 'name',
    description:
      'The name of the user registration method by which you want to search for users registered by this method',
    schema: { example: 'Google' },
  })
  findUsersWithRegistrationMethod(@Param('name') name: string) {
    return this.userRegistrationMethodService
      .findRegisteredUsersByMethodName(name)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'User registration method was successfully updated.',
    type: UserRegistrationMethodEntity,
  })
  @ApiNotFoundResponse({
    description: 'The user registration method with requested name was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Put(':name')
  @ApiParam({
    name: 'name',
    description: 'The name of the user registration method to be updated',
    schema: { example: 'Google' },
  })
  update(
    @Param('name') name: string,
    @Body() updateUserRegistrationMethodDto: UpdateUserRegistrationMethodDto,
  ) {
    return this.userRegistrationMethodService
      .update(name, updateUserRegistrationMethodDto)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'User registration method was successfully removed.',
    type: UserRegistrationMethodEntity,
  })
  @ApiNotFoundResponse({
    description: 'The user registration method with requested name was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Delete(':name')
  @ApiParam({
    name: 'name',
    description: 'The name of the user registration method to be deleted',
    schema: { example: 'Google' },
  })
  remove(@Param('name') name: string) {
    return this.userRegistrationMethodService
      .remove(name)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }
}
