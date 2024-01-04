import { ApiProperty } from '@nestjs/swagger';
import { UserRegistrationMethod } from '@prisma/client';
import { IsDefined, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';

export class UserRegistrationMethodEntity implements UserRegistrationMethod {
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

  @ApiProperty({
    description: 'The nested array of users registered with this registration method',
  })
  users?: UserPublicEntity[];
}
