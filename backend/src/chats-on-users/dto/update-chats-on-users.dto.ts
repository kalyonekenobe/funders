import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, ValidateIf } from 'class-validator';
import { ChatsOnUsersEntity } from '../entities/chats-on-users.entity';

export class UpdateChatsOnUsersDto
  implements Omit<Partial<ChatsOnUsersEntity>, 'chatId' | 'userId'>
{
  @ApiProperty({
    description: 'The role of the user in the chat',
    examples: ['Owner', 'Moderator', 'Default'],
    default: 'Owner',
  })
  @Matches(/^[a-zA-Z_0-9 ]+$/)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value)
  role?: string;
}
