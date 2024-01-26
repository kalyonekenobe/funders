import { ApiProperty } from '@nestjs/swagger';
import { PostAttachment } from '@prisma/client';
import { IsDefined, IsNotEmpty, IsString, IsUUID, MaxLength, ValidateIf } from 'class-validator';
import { PostEntity } from 'src/post/entities/post.entity';

export class PostAttachmentEntity implements PostAttachment {
  @ApiProperty({
    description: 'The uuid of post attachment',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  id: string;

  @ApiProperty({
    description: 'The uuid of post of the post attachment',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  postId: string;

  @ApiProperty({ description: 'The filepath of post attachment' })
  @IsString()
  @MaxLength(255)
  @IsDefined()
  file: string;

  @ApiProperty({
    description: 'Custom filename of the file of the post attachment',
    examples: ['Image', 'Attachment_123', 'Document'],
    default: 'Image',
  })
  @IsString()
  @MaxLength(255)
  @ValidateIf((_, value) => value)
  filename: string | null;

  @ApiProperty({ description: 'Nested post object for this post attachment' })
  post?: PostEntity;
}
