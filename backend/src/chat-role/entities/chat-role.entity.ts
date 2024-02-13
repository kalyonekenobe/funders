import { ApiProperty } from '@nestjs/swagger';
import { ChatRole } from '@prisma/client';
import { IsDefined, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { ChatsOnUsersEntity } from 'src/chats-on-users/entities/chats-on-users.entity';

export class ChatRoleEntity implements ChatRole {
  @ApiProperty({
    description: 'Name of the chat role',
    examples: ['Owner', 'Moderator', 'Default'],
    default: 'Owner',
  })
  @Matches(/^[a-zA-Z_0-9 ]+$/)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;

  @ApiProperty({
    description: 'The nested array of chatsOnUsers which have this chat role',
  })
  chatsOnUsers?: ChatsOnUsersEntity[];
}
