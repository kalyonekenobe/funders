import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, IsUUID, Matches, ValidateIf } from 'class-validator';
import { ChatMessageEntity } from '../entities/chat-message.entity';

export class CreateChatMessageDto
  implements
    Omit<ChatMessageEntity, 'id' | 'chatId' | 'isPinned' | 'createdAt' | 'updatedAt' | 'removedAt'>
{
  @ApiProperty({
    description: "Author's uuid",
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  authorId: string;

  @ApiProperty({
    description: 'Parent chat message uuid',
    examples: [
      'jf9151j4-9503-1054-811k-84mg95mmkt0lfmaz',
      'fj5mgsq4-jjf1-49g1-a031-9941ng1ancag8h7m',
    ],
    default: 'fj5mgsq4-jjf1-49g1-a031-9941ng1ancag8h7m',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  @ValidateIf((_, value) => value)
  replyTo: string | null;

  @ApiProperty({
    description: 'The text of the chat message',
    examples: ['Hi', 'Hello, world!', 'The first message'],
    default: 'The first message',
  })
  @Matches(/^[\p{Letter}\p{Mark}\-!?\.,:@#№$;%^&*()_+="'`/\\{}\[\]|~\d\s<>]+$/gu)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  text: string;

  @ApiProperty({ description: 'The nested array of attachments of this chat message' })
  attachments?: any[];
}
