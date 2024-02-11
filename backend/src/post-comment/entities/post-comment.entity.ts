import { ApiProperty } from '@nestjs/swagger';
import { PostComment } from '@prisma/client';
import { IsDate, IsDefined, IsNotEmpty, IsString, IsUUID, Matches, MaxDate } from 'class-validator';
import { PostEntity } from 'src/post/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';

export class PostCommentEntity implements PostComment {
  @ApiProperty({
    description: 'Post comment uuid',
    examples: ['jf9151j4-9503-1054-811k-84mg95mmkt0lfmaz', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'jf9151j4-9503-1054-811k-84mg95mmkt0lfmaz',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  id: string;

  @ApiProperty({
    description: 'Post comment post uuid',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  postId: string;

  @ApiProperty({
    description: "Post comment author's uuid",
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  authorId: string;

  @ApiProperty({
    description: 'Post comment parent uuid',
    examples: [
      'jf9151j4-9503-1054-811k-84mg95mmkt0lfmaz',
      '989d32c2-abd4-43d3-a420-ee175ae16b98',
      null,
    ],
    default: null,
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  parentCommentId: string | null;

  @ApiProperty({
    description: 'The content of the post comment',
    examples: ['The content of the post comment', 'Hello, world!', 'The first comment'],
    default: 'The content of the post comment',
  })
  @Matches(/^[\p{Letter}\p{Mark}\-!?\.,:@#№$;%^&*()_+="'`/\\{}\[\]|~\d\s<>]+$/gu)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  content: string;

  @ApiProperty({
    description: 'The date and time the post comment was created',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2023-06-30'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the post comment was updated',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2023-11-02'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  updatedAt: Date | null;

  @ApiProperty({
    description: 'The date and time the post comment was removed',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  removedAt: Date | null;

  @ApiProperty({ description: 'The nested object of post of post comment' })
  post?: PostEntity;

  @ApiProperty({ description: 'The nested object of author of post comment' })
  author?: UserEntity;

  @ApiProperty({ description: 'The nested object of parent post comment of post comment' })
  parentComment?: PostCommentEntity;

  @ApiProperty({ description: 'The nested array of replies of post comment' })
  replies?: PostCommentEntity[];

  // reactions?: PostCommentReactionEntity[];

  attachments?: any[];
}
