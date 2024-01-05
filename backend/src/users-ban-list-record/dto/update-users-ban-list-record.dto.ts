import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { UsersBanListRecordEntity } from '../entities/users-ban-list-record.entity';

export class UpdateUsersBanListRecordDto
  implements Omit<Partial<UsersBanListRecordEntity>, 'id' | 'userId' | 'bannedAt'>
{
  @ApiProperty({
    description: 'Status of the users ban list record',
    examples: ['Temporary', 'Permanent'],
    default: 'Permanent',
  })
  @Matches(/^[a-zA-Z_0-9]+$/)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value)
  status?: string;

  @ApiProperty({
    description: "The users ban list record date and time user's ban is due to",
    examples: [
      new Date('2024-12-20T14:24:00.000Z'),
      new Date('2023-12-31T09:54:46.000Z'),
      new Date('2024-01-01T23:14:45.000Z'),
    ],
    default: new Date('2024-12-20T14:24:00.000Z'),
  })
  @Transform(date => (date.value ? new Date(date.value) : date.value))
  @IsDate()
  @ValidateIf((_, value) => value)
  dueTo?: Date | null;

  @ApiProperty({
    description: 'The users ban list record note',
    examples: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Eu consequat ac felis donec et odio pellentesque diam. Felis eget velit aliquet sagittis. In metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Eget nunc scelerisque viverra mauris in aliquam sem fringilla. Facilisi cras fermentum odio eu feugiat pretium nibh. Nisi porta lorem mollis aliquam ut porttitor leo. Viverra ipsum nunc aliquet bibendum. Urna porttitor rhoncus dolor purus non enim. Massa massa ultricies mi quis hendrerit dolor magna eget est.',
    ],
    default:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value)
  note?: string;

  @ApiProperty({
    description: 'The total value of user permissions penalty',
    examples: [255, 15, 127, 31],
    default: 255,
  })
  @Max(2 ** 64 - 1)
  @IsNumber()
  @ValidateIf((_, value) => value)
  permissionsPenalty?: bigint;
}
