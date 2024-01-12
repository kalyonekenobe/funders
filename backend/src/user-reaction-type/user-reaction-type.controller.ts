import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserReactionTypeService } from './user-reaction-type.service';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { throwHttpExceptionBasedOnErrorType } from 'src/core/error-handling/error-handler';
import { UserReactionTypeEntity } from './entities/user-reaction-type.entity';
import { UpdateUserReactionTypeDto } from './dto/update-user-reaction-type.dto';
import { CreateUserReactionTypeDto } from './dto/create-user-reaction-type.dto';

@ApiTags('User reaction types')
@Controller('user-reaction-types')
export class UserReactionTypeController {
  constructor(private readonly userReactionTypeService: UserReactionTypeService) {}

  @ApiCreatedResponse({
    description: 'User reaction type was successfully created.',
    type: UserReactionTypeEntity,
  })
  @ApiConflictResponse({
    description: 'Cannot create user reaction type. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post()
  create(@Body() createUserReactionTypeDto: CreateUserReactionTypeDto) {
    return this.userReactionTypeService
      .create(createUserReactionTypeDto)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'The list of user reaction types',
    type: [UserReactionTypeEntity],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get()
  findAll() {
    return this.userReactionTypeService
      .findAll()
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'User reaction type was successfully updated.',
    type: UserReactionTypeEntity,
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
  @Put(':name')
  @ApiParam({
    name: 'name',
    description: 'The name of the user reaction type to be updated',
    schema: { example: 'Like' },
  })
  update(
    @Param('name') name: string,
    @Body() updateUserReactionTypeDto: UpdateUserReactionTypeDto,
  ) {
    return this.userReactionTypeService
      .update(name, updateUserReactionTypeDto)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }

  @ApiOkResponse({
    description: 'User reaction type was successfully removed.',
    type: UserReactionTypeEntity,
  })
  @ApiNotFoundResponse({
    description: 'The user reaction type with requested name was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Delete(':name')
  @ApiParam({
    name: 'name',
    description: 'The name of the user reaction type to be deleted',
    schema: { example: 'Like' },
  })
  remove(@Param('name') name: string) {
    return this.userReactionTypeService
      .remove(name)
      .then(response => response)
      .catch(error => throwHttpExceptionBasedOnErrorType(error));
  }
}
