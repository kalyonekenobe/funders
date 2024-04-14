import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
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
import { Permissions, UserRequestBodyFiles } from './types/user.types';
import { UploadRestrictions } from 'src/core/decorators/upload-restrictions.decorator';
import { UploadResourceTypes } from 'src/core/constants/constants';
import { PostReactionService } from 'src/post-reaction/post-reaction.service';
import { PostReactionEntity } from 'src/post-reaction/entities/post-reaction.entity';
import { PostCommentService } from 'src/post-comment/post-comment.service';
import { PostCommentEntity } from 'src/post-comment/entities/post-comment.entity';
import { PostCommentReactionService } from 'src/post-comment-reaction/post-comment-reaction.service';
import { PostCommentReactionEntity } from 'src/post-comment-reaction/entities/post-comment-reaction.entity';
import { ChatsOnUsersService } from 'src/chats-on-users/chats-on-users.service';
import { ChatEntity } from 'src/chat/entities/chat.entity';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { Auth } from 'src/core/decorators/auth.decorator';
import { Request } from 'express';
import { PostEntity } from 'src/post/entities/post.entity';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly usersBanListRecordService: UsersBanListRecordService,
    private readonly postService: PostService,
    private readonly postReactionService: PostReactionService,
    private readonly postCommentService: PostCommentService,
    private readonly postCommentReactionService: PostCommentReactionService,
    private readonly chatsOnUsersService: ChatsOnUsersService,
  ) {}

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_USERS })
  @ApiCreatedResponse({
    description: 'User was successfully created.',
    type: UserPublicEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
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
  async create(
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

  @Auth(JwtAuthGuard, { permissions: Permissions.MANAGE_USER_BANS })
  @ApiCreatedResponse({
    description: 'Users ban list record was successfully created.',
    type: UsersBanListRecordEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
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
  async createUsersBanListRecord(
    @Param('id') userId: string,
    @Body() createUsersBanListRecordRequestBodyDto: CreateUsersBanListRecordRequestBodyDto,
  ) {
    return this.usersBanListRecordService.create({
      ...createUsersBanListRecordRequestBodyDto,
      userId,
    });
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: "The list of user's ban list records",
    type: [UsersBanListRecordEntity],
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
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
  async findAllUserBans(@Param('id') userId: string) {
    return this.usersBanListRecordService.findAllUserBans(userId);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: "The list of user's post reactions",
    type: [PostReactionEntity],
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The user with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the user to get his list of post reactions',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id/post-reactions')
  async findAllUserPostReactions(@Param('id') userId: string) {
    return this.postReactionService.findAllForUser(userId);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: "The list of user's post comment reactions",
    type: [PostCommentReactionEntity],
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The user with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the user to get his list of post comment reactions',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id/comment-reactions')
  async findAllUserPostCommentReactions(@Param('id') userId: string) {
    return this.postCommentReactionService.findAllForUser(userId);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: "The list of user's chats",
    type: [ChatEntity],
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The user with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the user to get his list of chats',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id/chats')
  async findAllUserChats(@Param('id') userId: string) {
    return this.chatsOnUsersService.findAllChatsForUser(userId);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: "The list of user's post comments",
    type: [PostCommentEntity],
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The user with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the user to get his list of post comments',
    schema: { example: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f' },
  })
  @Get(':id/comments')
  async findAllUserComments(@Param('id') userId: string) {
    return this.postCommentService.findAllForUser(userId);
  }

  @ApiOkResponse({
    description: 'The list of users',
    type: [UserPublicEntity],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get()
  async findAll() {
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
  async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'The list of posts of the user with requested id',
    type: [PostEntity],
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
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
  async findAllUserPosts(@Param('id') id: string) {
    return this.postService.findAllUserPosts(id);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'User was successfully updated.',
    type: UserPublicEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
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
  async update(
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
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const authenticatedUser = request.user as UserPublicEntity;

    if (
      id !== authenticatedUser.id &&
      ((Number(authenticatedUser.userRole?.permissions) ?? 0) & Permissions.MANAGE_USERS) !==
        Permissions.MANAGE_USERS
    ) {
      throw new ForbiddenException({
        message: 'Forbidden',
        error: 'The user is forbidden to perform this action.',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }

    return this.userService.update(id, updateUserDto, files);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'User was successfully removed.',
    type: UserPublicEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
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
  remove(@Req() request: Request, @Param('id') id: string) {
    const authenticatedUser = request.user as UserPublicEntity;

    if (
      id !== authenticatedUser.id &&
      ((Number(authenticatedUser.userRole?.permissions) ?? 0) & Permissions.MANAGE_USERS) !==
        Permissions.MANAGE_USERS
    ) {
      throw new ForbiddenException({
        message: 'Forbidden',
        error: 'The user is forbidden to perform this action.',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }

    return this.userService.remove(id);
  }
}
