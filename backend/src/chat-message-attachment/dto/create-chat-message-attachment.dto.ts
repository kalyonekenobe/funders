import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, IsUUID, MaxLength, ValidateIf } from 'class-validator';
import { ChatMessageAttachmentEntity } from '../entities/chat-message-attachment.entity';

export class CreateChatMessageAttachmentDto implements Omit<ChatMessageAttachmentEntity, 'id'> {
  @ApiProperty({
    description: 'The uuid of chat message of the chat message attachment',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  messageId: string;

  @ApiProperty({
    description: 'The filepath of chat message attachment',
    examples: [
      'chat_message_attachments/989d32c2-abd4-43d3-a420-ee175ae16b98.pptx',
      'chat_message_attachments/b7af9cd4-5533-4737-862b-78bce985c987.jpg',
      'chat_message_attachments/jg741k58-9471-5432-581g-25fal951o571.txt',
    ],
    default: 'chat_message_attachments/jg741k58-9471-5432-581g-25fal951o571.txt',
  })
  @IsString()
  @MaxLength(255)
  @IsDefined()
  file: string;

  @ApiProperty({
    description: 'Custom filename of the file of the chat message attachment',
    examples: ['Image', 'Attachment_123', 'Document'],
    default: 'Image',
  })
  @IsString()
  @MaxLength(255)
  @ValidateIf((_, value) => value)
  filename: string | null;

  @ApiProperty({
    description: 'Resource type of the file of the chat message attachment',
    examples: ['raw', 'image', 'video'],
    default: 'raw',
  })
  @IsString()
  @MaxLength(255)
  @IsDefined()
  resourceType: string;
}
