import { ApiProperty } from '@nestjs/swagger';
import { ChatsOnUsers } from '@prisma/client';
import { IsDefined, IsNotEmpty, IsString, IsUUID, Matches, MaxLength } from 'class-validator';
import { ChatRoleEntity } from 'src/chat-role/entities/chat-role.entity';
import { ChatEntity } from 'src/chat/entities/chat.entity';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';

export class ChatsOnUsersEntity implements ChatsOnUsers {
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
    description: "User's uuid",
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  userId: string;

  @ApiProperty({
    description: 'The role of the user in the chat',
    examples: ['Owner', 'Moderator', 'Default'],
    default: 'Owner',
  })
  @Matches(/^[a-zA-Z_0-9 ]+$/)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  role: string;

  @ApiProperty({ description: 'The nested object of chat of this chatsOnUsers entity' })
  chat?: ChatEntity;

  @ApiProperty({ description: 'The nested object of user of this chatsOnUsers entity' })
  user?: UserPublicEntity;

  @ApiProperty({ description: 'The nested object of chat role of this chatsOnUsers entity' })
  chatRole?: ChatRoleEntity;
}
