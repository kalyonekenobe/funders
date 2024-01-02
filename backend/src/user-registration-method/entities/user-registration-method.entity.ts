import { ApiProperty } from '@nestjs/swagger';
import { UserRegistrationMethod } from '@prisma/client';

export class UserRegistrationMethodEntity implements UserRegistrationMethod {
  @ApiProperty({
    description: 'Name of the registration method',
    examples: ['Google', 'Facebook', 'Microsoft', 'Apple', 'LinkedIn'],
    default: 'Google',
  })
  name: string;

  // users?: UserEntity[];
  users?: any[];
}
