import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, MaxLength, ValidateIf } from 'class-validator';
import { PostReactionEntity } from '../entities/post-reaction.entity';

export class UpdatePostReactionDto
  implements Omit<Partial<PostReactionEntity>, 'userId' | 'postId' | 'datetime'>
{
  @ApiProperty({
    description: 'The reaction type of the post reaction',
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
