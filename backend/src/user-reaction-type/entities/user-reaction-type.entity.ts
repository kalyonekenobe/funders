import { ApiProperty } from '@nestjs/swagger';
import { UserReactionType } from '@prisma/client';
import { IsDefined, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { PostCommentEntity } from 'src/post-comment/entities/post-comment.entity';
import { PostEntity } from 'src/post/entities/post.entity';

export class UserReactionTypeEntity implements UserReactionType {
  @ApiProperty({
    description: 'Name of the user reaction type',
    examples: ['Like', 'Dislike', 'Heart', 'Anger', 'Crying', 'Laugh'],
    default: 'Like',
  })
  @Matches(/^[a-zA-Z_0-9]+$/)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;

  @ApiProperty({
    description: 'The nested array of posts which have this reaction',
  })
  posts?: PostEntity[];

  @ApiProperty({
    description: 'The nested array of posts comments which have this reaction',
  })
  comments?: PostCommentEntity[];
}
