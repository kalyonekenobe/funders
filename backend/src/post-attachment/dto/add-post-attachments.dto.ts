import { ApiProperty } from '@nestjs/swagger';
import { CreatePostAttachmentDto } from './create-post-attachment.dto';
import { IsArray, IsDefined } from 'class-validator';

type AddPostAttachments = {
  attachments: Omit<CreatePostAttachmentDto, 'postId' | 'file'>[];
};

export class AddPostAttachmentsDto implements AddPostAttachments {
  @ApiProperty({ description: 'The nested list of post attachments to create' })
  @IsArray()
  @IsDefined()
  attachments: Omit<CreatePostAttachmentDto, 'postId' | 'file'>[];
}
