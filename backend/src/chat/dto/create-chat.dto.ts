import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, Matches, MaxLength, ValidateIf } from 'class-validator';
import { ChatEntity } from '../entities/chat.entity';

export class CreateChatDto implements Omit<ChatEntity, 'id'> {
  @ApiProperty({
    description: 'Name of the chat',
    examples: ['New chat', 'Chat', 'Friends'],
    default: 'Friends',
  })
  @Matches(/^[\p{Letter}\p{Mark}\- !?\.,:\d@#№$;%^&*()_+=\"\'\`\/\\\{\}\[\]\|\~]+$/gu)
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ValidateIf((_, value) => value !== null)
  name: string | null;
}
