import { ApiProperty } from '@nestjs/swagger';
import { ChatRoleEntity } from '../entities/chat-role.entity';
import { IsDefined, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateChatRoleDto implements ChatRoleEntity {
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
}
