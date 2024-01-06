import { ApiProperty } from '@nestjs/swagger';
import { UserReactionType } from '@prisma/client';
import { IsDefined, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

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
  //posts?: PostEntity[];
  posts?: any[];

  @ApiProperty({
    description: 'The nested array of posts comments which have this reaction',
  })
  //posts?: PostCommentEntity[];
  postsComments?: any[];
}
