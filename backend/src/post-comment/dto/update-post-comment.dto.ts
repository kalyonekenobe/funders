import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsString,
  Matches,
  MaxDate,
  ValidateIf,
} from 'class-validator';
import { PostCommentEntity } from '../entities/post-comment.entity';

export class CreatePostCommentDto
  implements
    Omit<
      Partial<PostCommentEntity>,
      'id' | 'postId' | 'authorId' | 'parentCommentId' | 'createdAt' | 'updatedAt'
    >
{
  @ApiProperty({
    description: 'The content of the post comment',
    examples: ['The content of the post comment', 'Hello, world!', 'The first comment'],
    default: 'The content of the post comment',
  })
  @Matches(/^[\p{Letter}\p{Mark}\-!?\.,:@#№$;%^&*()_+="'`/\\{}\[\]|~\d\s<>]+$/gu)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ValidateIf((_, value) => value)
  content?: string;

  @ApiProperty({
    description: 'The date and time the post comment was removed',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  @ValidateIf((_, value) => value)
  removedAt?: Date | null;

  // attachments?: PostCommentAttachmentEntity[];
}
