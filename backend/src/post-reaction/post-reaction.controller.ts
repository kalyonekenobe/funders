import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PostReactionService } from './post-reaction.service';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostReactionEntity } from './entities/post-reaction.entity';
import { CreatePostReactionDto } from './dto/create-post-reaction.dto';
import { UpdatePostReactionDto } from './dto/update-post-reaction.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';

@ApiTags('Posts')
@Controller('posts')
export class PostReactionController {
  constructor(private readonly postReactionService: PostReactionService) {}

  @ApiOkResponse({
    description: 'The list of post reactions',
    type: [PostReactionEntity],
  })
  @ApiNotFoundResponse({
    description: 'The post with specified id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be found',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/reactions')
  async findAllPostReactions(@Param('id') id: string) {
    return this.postReactionService.findAllForPost(id);
  }

  @Auth(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Post reaction was successfully created.',
    type: PostReactionEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The post with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot create post reaction. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Post(':id/reactions')
  async create(@Param('id') id: string, @Body() createPostReactionDto: CreatePostReactionDto) {
    return this.postReactionService.create(id, createPostReactionDto);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Post reaction was successfully updated.',
    type: PostReactionEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The post and user with the requested ids were not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update post reaction. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'postId',
    description: 'The uuid of the post to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiParam({
    name: 'userId',
    description: 'The uuid of the user to be found.',
    schema: { example: 'b7af9cd4-5533-4737-862b-78bce985c987' },
  })
  @Put(':postId/reactions/:userId')
  async update(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
    @Body() updatePostReactionDto: UpdatePostReactionDto,
  ) {
    return this.postReactionService.update(postId, userId, updatePostReactionDto);
  }

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Post reaction was successfully removed.',
    type: PostReactionEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiNotFoundResponse({
    description: 'The post and user with the requested ids were not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'postId',
    description: 'The uuid of the post to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiParam({
    name: 'userId',
    description: 'The uuid of the user to be found.',
    schema: { example: 'b7af9cd4-5533-4737-862b-78bce985c987' },
  })
  @Delete(':postId/reactions/:userId')
  async remove(@Param('postId') postId: string, @Param('userId') userId: string) {
    return this.postReactionService.remove(postId, userId);
  }
}
