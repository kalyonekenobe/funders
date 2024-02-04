import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, ValidateIf } from 'class-validator';
import { PostAttachmentEntity } from '../entities/post-attachment.entity';

export class UpdatePostAttachmentDto
  implements Omit<Partial<PostAttachmentEntity>, 'id' | 'postId'>
{
  @ApiProperty({
    description: 'The filepath of post attachment',
    examples: [
      'post_attachments/989d32c2-abd4-43d3-a420-ee175ae16b98.pptx',
      'post_attachments/b7af9cd4-5533-4737-862b-78bce985c987.jpg',
      'post_attachments/jg741k58-9471-5432-581g-25fal951o571.txt',
    ],
    default: 'post_attachments/jg741k58-9471-5432-581g-25fal951o571.txt',
  })
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
