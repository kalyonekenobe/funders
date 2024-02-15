import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxDate,
  MaxLength,
} from 'class-validator';

export class CreateUserDto
  implements
    Omit<
      User,
      'id' | 'phone' | 'bio' | 'avatar' | 'refreshToken' | 'stripeCustomerId' | 'registeredAt'
    >
{
  @ApiProperty({
    description: "User's registration method",
    examples: ['Google', 'Facebook', 'Microsoft', 'Apple', 'LinkedIn'],
    default: 'Google',
  })
  @Matches(/^[a-zA-Z_0-9]+$/)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  registrationMethod: string;

  @ApiProperty({
    description: "User's role",
    examples: ['Default', 'Volunteer', 'Administrator'],
    default: 'Administrator',
  })
  @Matches(/^[a-zA-Z_0-9]+$/)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  role: string;

  @ApiProperty({
    description: "User's first name",
    examples: ['Alex', 'Helen', 'John'],
    default: 'Alex',
  })
  @Matches(/^[\p{Letter}\p{Mark}\- ]+$/gu)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  firstName: string;

  @ApiProperty({
    description: "User's last name",
    examples: ['Igumnov', 'Smith', 'Doe'],
    default: 'Igumnov',
  })
  @Matches(/^[\p{Letter}\p{Mark}\- ]+$/gu)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  lastName: string;

  @ApiProperty({
    description: "User's birth date",
    examples: [new Date('2004-09-03'), new Date('1998-11-30'), new Date('1987-04-12')],
    default: new Date('2004-09-03'),
  })
  @Transform(date => new Date(date.value))
  @IsDate()
  @MaxDate(new Date(new Date().setFullYear(new Date().getFullYear() - 14)))
  @IsNotEmpty()
  @IsDefined()
  birthDate: Date;

  @ApiProperty({
    description: "User's email",
    examples: ['alexigumnov@gmail.com', 'helensmith@gmail.com', 'johndoe@gmail.com'],
    default: 'alexigumnov@gmail.com',
  })
  @MaxLength(50)
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email: string;

  @ApiProperty({
    description: "User's password",
    examples: [
      '8c2e53731925c9addc09145a7f1ea196f753cb115e8c9dfbb8fdcbe855a3beec',
      '32c9a2ec9e0c4e3a4cc93012b2e72c04b2c395578dcc80b535e951b452eaf9a3',
    ],
    default: '8c2e53731925c9addc09145a7f1ea196f753cb115e8c9dfbb8fdcbe855a3beec',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  password: string;
}
