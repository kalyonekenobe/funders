import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsDate, IsString, Matches, MaxDate, MaxLength } from 'class-validator';

export class UpdateUserDto
  implements Omit<User, 'id' | 'registrationMethod' | 'email' | 'registeredAt'>
{
  @ApiProperty({
    description: "User's role",
    examples: ['Default', 'Volunteer', 'Administrator'],
    default: 'Administrator',
  })
  @Matches(/^[a-zA-Z_0-9]+$/)
  @MaxLength(50)
  @IsString()
  role: string | null | undefined;

  @ApiProperty({
    description: "User's first name",
    examples: ['Alex', 'Helen', 'John'],
    default: 'Alex',
  })
  @Matches(/^[\p{Letter}\p{Mark}- ]+$/gu)
  @MaxLength(50)
  @IsString()
  firstName: string | null | undefined;

  @ApiProperty({
    description: "User's last name",
    examples: ['Igumnov', 'Smith', 'Doe'],
    default: 'Igumnov',
  })
  @Matches(/^[\p{Letter}\p{Mark}- ]+$/gu)
  @MaxLength(50)
  @IsString()
  lastName: string | null | undefined;

  @ApiProperty({
    description: "User's birth date",
    examples: [new Date('2004-09-03'), new Date('1998-11-30'), new Date('1987-04-12')],
    default: new Date('2004-09-03'),
  })
  @IsDate()
  @MaxDate(new Date(new Date().setFullYear(new Date().getFullYear() - 14)))
  birthDate: Date | null | undefined;

  @ApiProperty({
    description: "User's password",
    examples: [
      '8c2e53731925c9addc09145a7f1ea196f753cb115e8c9dfbb8fdcbe855a3beec',
      '32c9a2ec9e0c4e3a4cc93012b2e72c04b2c395578dcc80b535e951b452eaf9a3',
    ],
    default: '8c2e53731925c9addc09145a7f1ea196f753cb115e8c9dfbb8fdcbe855a3beec',
  })
  @IsString()
  password: string | null | undefined;

  @ApiProperty({
    description: "User's phone number",
    examples: ['+380987654321', '+145960105415', '+849501050319'],
    default: '+380987654321',
  })
  @MaxLength(15)
  @IsString()
  phone: string | null | undefined;

  @ApiProperty({
    description: "User's bio",
    examples: [
      'Student of Kyiv-Mohyla Academy',
      'The mother of 3',
      'Full-Stack JavaScript Developer',
    ],
    default: 'Student of Kyiv-Mohyla Academy',
  })
  @IsString()
  bio: string | null | undefined;

  @ApiProperty({ description: "User's avatar" })
  avatar: Buffer | null | undefined;

  @ApiProperty({
    description: "User's refresh roken",
    examples: [
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggSWd1bW5vdiIsImlhdCI6MTUxNjIzOTAyMn0.fhRab81aDGeIyrQPsQDk5-EoFmX93_ImE4szjSFZE08',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkhlbGVuIFNtaXRoIiwiaWF0IjoxNTE2MjM5MDIyfQ.gpUgoLzilOQcnkgQZIZRd1TGlcT6_A0RMz30OwB8z4A',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    ],
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggSWd1bW5vdiIsImlhdCI6MTUxNjIzOTAyMn0.fhRab81aDGeIyrQPsQDk5-EoFmX93_ImE4szjSFZE08',
  })
  @IsString()
  refreshToken: string | null | undefined;
}
