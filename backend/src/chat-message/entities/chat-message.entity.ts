import { ApiProperty } from '@nestjs/swagger';
import { ChatMessage } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MaxDate,
  ValidateIf,
} from 'class-validator';
import { ChatEntity } from 'src/chat/entities/chat.entity';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';

export class ChatMessageEntity implements ChatMessage {
  @ApiProperty({
    description: 'Chat message uuid',
    examples: ['jf9151j4-9503-1054-811k-84mg95mmkt0lfmaz', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'jf9151j4-9503-1054-811k-84mg95mmkt0lfmaz',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  id: string;

  @ApiProperty({
    description: 'Chat uuid',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  chatId: string;

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

  @ApiProperty({
    description: 'Is the chat message pinned',
    examples: [false, true],
    default: false,
  })
  @IsBoolean()
  @IsDefined()
  isPinned: boolean;

  @ApiProperty({
    description: 'The date and time the chat message was created',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2023-06-30'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the chat message was updated',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2023-11-02'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  updatedAt: Date | null;

  @ApiProperty({
    description: 'The date and time the chat message was removed',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  removedAt: Date | null;

  @ApiProperty({ description: 'The nested object of chat of this chat message' })
  chat?: ChatEntity;

  @ApiProperty({ description: 'The nested object of author of this chat message' })
  author?: UserPublicEntity;

  @ApiProperty({ description: 'The nested object of parent message of this chat message' })
  parentMessage?: ChatMessageEntity;

  @ApiProperty({ description: 'The nested array of replies of this chat message' })
  replies?: ChatMessageEntity[];

  // @ApiProperty({ description: 'The nested array of attachments of this chat message'})
  // attachments?: ChatMessageAttachmentEntity[];
}
