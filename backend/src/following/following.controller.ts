import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FollowingService } from './following.service';
import { FollowingEntity } from './entities/following.entity';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';

@ApiTags('Users')
@Controller('users')
export class FollowingController {
  constructor(private readonly followingService: FollowingService) {}

  @ApiCreatedResponse({
    description: 'Following was successfully created.',
    type: FollowingEntity,
  })
  @ApiNotFoundResponse({
    description: 'The following with the requested userId and followerId was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot create the following. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'userId',
    description: 'The id of the user to be followed',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiParam({
    name: 'followerId',
    description: 'The id of the follower who wants to follow the user with userId',
    schema: { example: 'b7af9cd4-5533-4737-862b-78bce985c987' },
  })
  @Post(':userId/followers/:followerId')
  create(@Param('userId') userId: string, @Param('followerId') followerId: string) {
    return this.followingService.create({ userId, followerId });
  }

  @ApiOkResponse({
    description: 'The list of user followings.',
    type: [UserPublicEntity],
  })
  @ApiNotFoundResponse({
    description: 'The user with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get(':id/followings')
  @ApiParam({
    name: 'id',
    description: 'The id of the user',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  findAllUserFollowings(@Param('id') id: string) {
    return this.followingService.findAllUserFollowings(id);
  }

  @ApiOkResponse({
    description: 'The list of user followers.',
    type: [UserPublicEntity],
  })
  @ApiNotFoundResponse({
    description: 'The user with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get(':id/followers')
  @ApiParam({
    name: 'id',
    description: 'The id of the user',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  findAllUserFollowers(@Param('id') id: string) {
    return this.followingService.findAllUserFollowers(id);
  }

  @ApiOkResponse({
    description: 'Following was successfully removed.',
    type: FollowingEntity,
  })
  @ApiNotFoundResponse({
    description: 'The following with the requested userId and followerId was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Delete(':userId/followers/:followerId')
  @ApiParam({
    name: 'userId',
    description: 'The id of the user to be unfollowed',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiParam({
    name: 'followerId',
    description: 'The id of the follower who wants to unfollow the user with userId',
    schema: { example: 'b7af9cd4-5533-4737-862b-78bce985c987' },
  })
  remove(@Param('userId') userId: string, @Param('followerId') followerId: string) {
    return this.followingService.remove(userId, followerId);
  }
}
