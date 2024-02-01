import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, ValidateIf } from 'class-validator';
import { PostAttachmentEntity } from '../entities/post-attachment.entity';

export class UpdatePostAttachmentDto
  implements Omit<Partial<PostAttachmentEntity>, 'id' | 'postId'>
{
  @ApiProperty({ description: 'The file path of post attachment' })
  @IsString()
  @MaxLength(255)
  @ValidateIf((_, value) => value)
  file?: string;

  @ApiProperty({
    description: 'Custom filename of the file of the post attachment',
    examples: ['Image', 'Attachment_123', 'Document'],
    default: 'Image',
  })
  @IsString()
  @MaxLength(255)
  @ValidateIf((_, value) => value)
  filename?: string | null;

  @ApiProperty({
    description: 'Resource type of the file of the post attachment',
    examples: ['raw', 'image', 'video'],
    default: 'raw',
  })
  @IsString()
  @MaxLength(255)
  @ValidateIf((_, value) => value)
  resourceType?: string;
}
