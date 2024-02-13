import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, IsUUID, Matches, MaxLength } from 'class-validator';
import { ChatsOnUsersEntity } from '../entities/chats-on-users.entity';

export class CreateChatsOnUsersDto implements Omit<ChatsOnUsersEntity, 'chatId'> {
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
}
