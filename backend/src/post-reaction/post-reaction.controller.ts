import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PostReactionService } from './post-reaction.service';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PostReactionEntity } from './entities/post-reaction.entity';
import { CreatePostReactionDto } from './dto/create-post-reaction.dto';
import { UpdatePostReactionDto } from './dto/update-post-reaction.dto';

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
  findAllPostReactions(@Param('id') id: string) {
    return this.postReactionService.findAllForPost(id);
  }

  @ApiCreatedResponse({
    description: 'Post reaction was successfully created.',
    type: PostReactionEntity,
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
  create(@Param('id') id: string, @Body() createPostReactionDto: CreatePostReactionDto) {
    return this.postReactionService.create(id, createPostReactionDto);
  }

  @ApiOkResponse({
    description: 'Post reaction was successfully updated.',
    type: PostReactionEntity,
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
  update(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
    @Body() updatePostReactionDto: UpdatePostReactionDto,
  ) {
    return this.postReactionService.update(postId, userId, updatePostReactionDto);
  }

  @ApiOkResponse({
    description: 'Post reaction was successfully removed.',
    type: PostReactionEntity,
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
  remove(@Param('postId') postId: string, @Param('userId') userId: string) {
    return this.postReactionService.remove(postId, userId);
  }
}
