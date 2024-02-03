import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiConsumes,
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
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersBanListRecordService } from 'src/users-ban-list-record/users-ban-list-record.service';
import { CreateUsersBanListRecordRequestBodyDto } from 'src/users-ban-list-record/dto/create-users-ban-list-record-request-body.dto';
import { UsersBanListRecordEntity } from 'src/users-ban-list-record/entities/users-ban-list-record.entity';
import { PostService } from 'src/post/post.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserRequestBodyFiles } from './types/user.types';
import { UploadRestrictions } from 'src/core/decorators/upload-restrictions.decorator';
import { UploadResourceTypes } from 'src/core/constants/constants';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly usersBanListRecordService: UsersBanListRecordService,
    private readonly postService: PostService,
  ) {}

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
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  @Post()
  create(
    @UploadedFiles()
    @UploadRestrictions([
      {
        fieldname: 'avatar',
        minFileSize: 1,
        maxFileSize: 1024 * 1024 * 5,
        allowedMimeTypes: UploadResourceTypes.IMAGE,
      },
    ])
    files: UserRequestBodyFiles,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.userService.create(createUserDto, files);
  }

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
  createUsersBanListRecord(
    @Param('id') userId: string,
    @Body() createUsersBanListRecordRequestBodyDto: CreateUsersBanListRecordRequestBodyDto,
  ) {
    return this.usersBanListRecordService.create({
      ...createUsersBanListRecordRequestBodyDto,
      userId,
    });
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
    return this.usersBanListRecordService.findAllUserBans(userId);
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
    return this.userService.findAll();
  }

  @ApiOkResponse({
    description: 'The user with requested id.',
    type: UserPublicEntity,
  })
  @ApiNotFoundResponse({
    description: 'The user with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the user to be found.',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
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
  @ApiParam({
    name: 'id',
    description: 'The uuid of the user to find all his posts',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id/posts')
  findAllUserPosts(@Param('id') id: string) {
    return this.postService.findAllUserPosts(id);
  }

  @ApiOkResponse({
    description: 'User was successfully updated.',
    type: UserPublicEntity,
  })
  @ApiNotFoundResponse({
    description: 'The user with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update user. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the user to be updated',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  @Put(':id')
  update(
    @UploadedFiles()
    @UploadRestrictions([
      {
        fieldname: 'avatar',
        minFileSize: 1,
        maxFileSize: 1024 * 1024 * 5,
        allowedMimeTypes: UploadResourceTypes.IMAGE,
      },
    ])
    files: UserRequestBodyFiles,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto, files);
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
  @ApiParam({
    name: 'id',
    description: 'The id of the user to be deleted',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
