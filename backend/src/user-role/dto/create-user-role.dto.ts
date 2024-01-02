import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsNumber, Matches, Max, MaxLength } from 'class-validator';

export class CreateUserRoleDto implements UserRole {
  @ApiProperty({
    description: 'Name of the user role',
    examples: ['Default', 'Volunteer', 'Administrator'],
    default: 'Administrator',
  })
  @Matches(/^[a-zA-Z_0-9]+$/)
  @MaxLength(50)
  @IsNotEmpty()
  @IsDefined()
  name: string;

  @ApiProperty({
    description: 'The total value of user role permissions',
    examples: [255, 15, 127, 31],
    default: 255,
  })
  @Max(2 ** 64 - 1)
  @IsNumber()
  @IsDefined()
  permissions: bigint;
}
