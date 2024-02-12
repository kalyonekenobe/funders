import { ApiProperty } from '@nestjs/swagger';
import { PostCommentReaction } from '@prisma/client';
import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxDate,
  MaxLength,
} from 'class-validator';
import { PostCommentEntity } from 'src/post-comment/entities/post-comment.entity';
import { UserReactionTypeEntity } from 'src/user-reaction-type/entities/user-reaction-type.entity';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';

export class PostCommentReactionEntity implements PostCommentReaction {
  @ApiProperty({
    description: 'Post comment uuid',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  commentId: string;

  @ApiProperty({
    description: "User's uuid",
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  userId: string;

  @ApiProperty({
    description: 'The reaction type of the post comment reaction',
    examples: ['Like', 'Dislike', 'Crying', 'Heart', 'Laugh', 'Anger'],
    default: 'Like',
  })
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  reactionType: string;

  @ApiProperty({
    description: 'The date and time of the post comment reaction',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2023-06-30'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  datetime: Date;

  @ApiProperty({ description: 'The nested object of user of this post comment reaction' })
  user?: UserPublicEntity;

  @ApiProperty({ description: 'The nested object of post comment of this post comment reaction' })
  comment?: PostCommentEntity;

  @ApiProperty({
    description: 'The nested object of user reaction type of this post comment reaction',
  })
  userReactionType?: UserReactionTypeEntity;
}
