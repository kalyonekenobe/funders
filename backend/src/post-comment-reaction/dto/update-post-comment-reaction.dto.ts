import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, MaxLength, ValidateIf } from 'class-validator';
import { PostCommentReactionEntity } from '../entities/post-comment-reaction.entity';

export class UpdatePostCommentReactionDto
  implements Omit<Partial<PostCommentReactionEntity>, 'userId' | 'commentId' | 'datetime'>
{
  @ApiProperty({
    description: 'The reaction type of the post comment reaction',
    examples: ['Like', 'Dislike', 'Crying', 'Heart', 'Laugh', 'Anger'],
    default: 'Like',
  })
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ValidateIf((_, value) => value)
  reactionType?: string;
}
