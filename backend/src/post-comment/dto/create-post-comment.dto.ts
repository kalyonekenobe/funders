import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, IsUUID, Matches, ValidateIf } from 'class-validator';
import { PostCommentEntity } from '../entities/post-comment.entity';
import { CreatePostCommentAttachmentDto } from 'src/post-comment-attachment/dto/create-post-comment-attachment.dto';

type CreatePostComment = Omit<
  PostCommentEntity,
  'id' | 'postId' | 'createdAt' | 'updatedAt' | 'removedAt' | 'attachments'
> & {
  attachments?: Omit<CreatePostCommentAttachmentDto, 'commentId'>[];
};

export class CreatePostCommentDto implements CreatePostComment {
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
  @IsDefined()
  @ValidateIf((_, value) => value)
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

  @ApiProperty({ description: 'The nested array of attachments of post comment' })
  attachments?: Omit<CreatePostCommentAttachmentDto, 'commentId'>[];
}
