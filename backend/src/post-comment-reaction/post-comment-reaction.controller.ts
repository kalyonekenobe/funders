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
import { PostCommentReactionService } from './post-comment-reaction.service';
import { PostCommentReactionEntity } from './entities/post-comment-reaction.entity';
import { CreatePostCommentReactionDto } from './dto/create-post-comment-reaction.dto';
import { UpdatePostCommentReactionDto } from './dto/update-post-comment-reaction.dto';

@ApiTags('Post comment reactions')
@Controller('comments')
export class PostCommentReactionController {
  constructor(private readonly postCommentReactionService: PostCommentReactionService) {}

  @ApiOkResponse({
    description: 'The list of post comment reactions',
    type: [PostCommentReactionEntity],
  })
  @ApiNotFoundResponse({
    description: 'The post comment with specified id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post comment to be found',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id/reactions')
  findAllPostCommentReactions(@Param('id') id: string) {
    return this.postCommentReactionService.findAllForComment(id);
  }

  @ApiCreatedResponse({
    description: 'Post comment reaction was successfully created.',
    type: PostCommentReactionEntity,
  })
  @ApiNotFoundResponse({
    description: 'The post comment with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot create post comment reaction. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post comment to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Post(':id/reactions')
  create(
    @Param('id') id: string,
    @Body() createPostCommentReactionDto: CreatePostCommentReactionDto,
  ) {
    return this.postCommentReactionService.create(id, createPostCommentReactionDto);
  }

  @ApiOkResponse({
    description: 'Post comment reaction was successfully updated.',
    type: PostCommentReactionEntity,
  })
  @ApiNotFoundResponse({
    description: 'The post comment and user with the requested ids were not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update post comment reaction. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The uuid of the post comment to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiParam({
    name: 'userId',
    description: 'The uuid of the user to be found.',
    schema: { example: 'b7af9cd4-5533-4737-862b-78bce985c987' },
  })
  @Put(':commentId/reactions/:userId')
  update(
    @Param('commentId') commentId: string,
    @Param('userId') userId: string,
    @Body() updatePostCommentReactionDto: UpdatePostCommentReactionDto,
  ) {
    return this.postCommentReactionService.update(commentId, userId, updatePostCommentReactionDto);
  }

  @ApiOkResponse({
    description: 'Post comment reaction was successfully removed.',
    type: PostCommentReactionEntity,
  })
  @ApiNotFoundResponse({
    description: 'The post comment and user with the requested ids were not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The uuid of the post comment to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @ApiParam({
    name: 'userId',
    description: 'The uuid of the user to be found.',
    schema: { example: 'b7af9cd4-5533-4737-862b-78bce985c987' },
  })
  @Delete(':commentId/reactions/:userId')
  remove(@Param('commentId') commentId: string, @Param('userId') userId: string) {
    return this.postCommentReactionService.remove(commentId, userId);
  }
}
