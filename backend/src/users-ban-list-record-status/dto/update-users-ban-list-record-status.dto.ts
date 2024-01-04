import { ApiProperty } from '@nestjs/swagger';
import { UsersBanListRecordStatus } from '@prisma/client';
import { IsDefined, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateUsersBanListRecordStatusDto implements UsersBanListRecordStatus {
  @ApiProperty({
    description: 'Name of the users ban list record status',
    examples: ['Temporary', 'Permanent'],
    default: 'Permanent',
  })
  @Matches(/^[a-zA-Z_0-9]+$/)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;
}
