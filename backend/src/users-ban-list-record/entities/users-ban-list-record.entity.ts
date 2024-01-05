import { ApiProperty } from '@nestjs/swagger';
import { UsersBanListRecord } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxDate,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';
import { UsersBanListRecordStatusEntity } from 'src/users-ban-list-record-status/entities/users-ban-list-record-status.entity';

export class UsersBanListRecordEntity implements UsersBanListRecord {
  @ApiProperty({
    description: 'Users ban list record uuid',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  id: string;

  @ApiProperty({
    description: "Users ban list record user's uuid",
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  userId: string;

  @ApiProperty({
    description: 'Status of the users ban list record',
    examples: ['Temporary', 'Permanent'],
    default: 'Permanent',
  })
  @Matches(/^[a-zA-Z_0-9]+$/)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  status: string;

  @ApiProperty({
    description: 'The users ban list record date and time when user was banned',
    examples: [
      new Date('2024-09-03T12:00:00.000Z'),
      new Date('2023-12-31T09:54:46.000Z'),
      new Date('2024-01-01T23:14:45.000Z'),
    ],
    default: new Date('2024-09-03T12:00:00.000Z'),
  })
  @Transform(date => new Date(date.value))
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  bannedAt: Date;

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
  dueTo: Date | null;

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
  @IsDefined()
  note: string;

  @ApiProperty({
    description: 'The total value of user permissions penalty',
    examples: [255, 15, 127, 31],
    default: 255,
  })
  @Max(2 ** 64 - 1)
  @IsNumber()
  @IsDefined()
  permissionsPenalty: bigint;

  @ApiProperty({ description: 'The nested object of status of the users ban list record' })
  usersBanListRecordStatus?: UsersBanListRecordStatusEntity;

  @ApiProperty({ description: 'The nested object of user of the users ban list record' })
  user?: UserPublicEntity;
}
