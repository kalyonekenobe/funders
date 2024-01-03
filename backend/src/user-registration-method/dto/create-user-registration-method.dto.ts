import { ApiProperty } from '@nestjs/swagger';
import { UserRegistrationMethod } from '@prisma/client';
import { IsDefined, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateUserRegistrationMethodDto implements UserRegistrationMethod {
  @ApiProperty({
    description: 'Name of the registration method',
    examples: ['Google', 'Facebook', 'Microsoft', 'Apple', 'LinkedIn'],
    default: 'Google',
  })
  @Matches(/^[a-zA-Z_0-9]+$/)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;
}
