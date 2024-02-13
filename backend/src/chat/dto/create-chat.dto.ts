import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, Matches, MaxLength, ValidateIf } from 'class-validator';
import { ChatEntity } from '../entities/chat.entity';
import { CreateChatsOnUsersDto } from 'src/chats-on-users/dto/create-chats-on-users.dto';

export class CreateChatDto implements Omit<ChatEntity, 'id' | 'users'> {
  @ApiProperty({
    description: 'Name of the chat',
    examples: ['New chat', 'Chat', 'Friends'],
    default: 'Friends',
  })
  @Matches(/^[\p{Letter}\p{Mark}\-!?\.,:@#№$;%^&*()_+="'`/\\{}\[\]|~\d\s]+$/gu)
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ValidateIf((_, value) => value !== null)
  name: string | null;

  @ApiProperty({
    description: 'The nested array of chatsOnUsers which have this chat',
  })
  @ValidateIf((_, value) => value)
  users?: CreateChatsOnUsersDto[];
}
