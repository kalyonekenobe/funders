import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  Matches,
  MaxDate,
  ValidateIf,
} from 'class-validator';
import { ChatMessageEntity } from '../entities/chat-message.entity';
import { CreateChatMessageAttachmentDto } from 'src/chat-message-attachment/dto/create-chat-message-attachment.dto';

type UpdateChatMessage = Omit<
  Partial<ChatMessageEntity>,
  'id' | 'chatId' | 'authorId' | 'replyTo' | 'createdAt' | 'updatedAt' | 'attachments'
> & {
  attachments?: Omit<CreateChatMessageAttachmentDto, 'messageId'>[];
};

export class UpdateChatMessageDto implements UpdateChatMessage {
  @ApiProperty({
    description: 'The text of the chat message',
    examples: ['Hi', 'Hello, world!', 'The first message'],
    default: 'The first message',
  })
  @Matches(/^[\p{Letter}\p{Mark}\-!?\.,:@#№$;%^&*()_+="'`/\\{}\[\]|~\d\s<>]+$/gu)
  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value)
  text?: string;

  @ApiProperty({
    description: 'Is the chat message pinned',
    examples: [false, true],
    default: false,
  })
  @IsBoolean()
  @ValidateIf((_, value) => value)
  isPinned?: boolean;

  @ApiProperty({
    description: 'The date and time the chat message was removed',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @ValidateIf((_, value) => value)
  removedAt?: Date | null;

  @ApiProperty({ description: 'The nested array of attachments of this chat message' })
  @ValidateIf((_, value) => value)
  attachments?: Omit<CreateChatMessageAttachmentDto, 'messageId'>[];
}
