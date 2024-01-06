import { ApiProperty } from '@nestjs/swagger';
import { Chat } from '@prisma/client';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class ChatEntity implements Chat {
  @ApiProperty({
    description: 'Chat uuid',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  id: string;

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
  chatsOnUsers?: any[];

  @ApiProperty({
    description: 'The nested array of messages which have this chat',
  })
  messages?: any[];
}
