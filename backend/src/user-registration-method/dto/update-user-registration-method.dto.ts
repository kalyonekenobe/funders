import { ApiProperty } from '@nestjs/swagger';
import { UserRegistrationMethod } from '@prisma/client';
import { IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class UpdateUserRegistrationMethodDto implements UserRegistrationMethod {
  @ApiProperty({
    description: 'Name of the registration method',
    examples: ['Google', 'Facebook', 'Microsoft', 'Apple', 'LinkedIn'],
    default: 'Google',
  })
  @Matches(/^[a-zA-Z_0-9]+$/)
  @MaxLength(50)
  @IsNotEmpty()
  name: string;
}
