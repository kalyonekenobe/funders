import { ApiProperty } from '@nestjs/swagger';
import { UsersBanListRecordStatus } from '@prisma/client';
import { IsDefined, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { UsersBanListRecordEntity } from 'src/users-ban-list-record/entities/users-ban-list-record.entity';

export class UsersBanListRecordStatusEntity implements UsersBanListRecordStatus {
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

  @ApiProperty({
    description: 'The nested array of users ban list records',
  })
  usersBanListRecords?: UsersBanListRecordEntity[];
}
