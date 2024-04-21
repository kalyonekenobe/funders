import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Matches,
  MaxDate,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { User } from '@prisma/client';

export class FindUserDto implements Omit<Partial<User>, 'password' | 'bio' | 'avatar'> {
  @ApiProperty({
    description: "User's uuid",
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @ValidateIf((_, value) => value)
  id?: string;

  @ApiProperty({
    description: "User's registration method",
    examples: ['Google', 'Facebook', 'Microsoft', 'Apple', 'LinkedIn'],
    default: 'Google',
  })
  @Matches(/^[a-zA-Z_0-9]+$/)
  @MaxLength(50)
  @IsString()
  @ValidateIf((_, value) => value)
  registrationMethod?: string;

  @ApiProperty({
    description: "User's role",
    examples: ['Default', 'Volunteer', 'Administrator'],
    default: 'Administrator',
  })
  @Matches(/^[a-zA-Z_0-9]+$/)
  @MaxLength(50)
  @IsString()
  @ValidateIf((_, value) => value)
  role?: string;

  @ApiProperty({
    description: "User's first name",
    examples: ['Alex', 'Helen', 'John'],
    default: 'Alex',
  })
  @Matches(/^[\p{Letter}\p{Mark}\- ]+$/gu)
  @MaxLength(50)
  @IsString()
  @ValidateIf((_, value) => value)
  firstName?: string;

  @ApiProperty({
    description: "User's last name",
    examples: ['Igumnov', 'Smith', 'Doe'],
    default: 'Igumnov',
  })
  @Matches(/^[\p{Letter}\p{Mark}\- ]+$/gu)
  @MaxLength(50)
  @IsString()
  @ValidateIf((_, value) => value)
  lastName?: string;

  @ApiProperty({
    description: "User's birth date",
    examples: [new Date('2004-09-03'), new Date('1998-11-30'), new Date('1987-04-12')],
    default: new Date('2004-09-03'),
  })
  @Transform(date => new Date(date.value))
  @IsDate()
  @MaxDate(new Date(new Date().setFullYear(new Date().getFullYear() - 14)))
  @ValidateIf((_, value) => value)
  birthDate?: Date;

  @ApiProperty({
    description: "User's email",
    examples: ['alexigumnov@gmail.com', 'helensmith@gmail.com', 'johndoe@gmail.com'],
    default: 'alexigumnov@gmail.com',
  })
  @MaxLength(50)
  @IsEmail()
  @ValidateIf((_, value) => value)
  email?: string;

  @ApiProperty({
    description: "User's phone number",
    examples: ['+380987654321', '+145960105415', '+849501050319'],
    default: '+380987654321',
  })
  @MaxLength(15)
  @IsPhoneNumber()
  @ValidateIf((_, value) => value)
  phone?: string | null;

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
  @ValidateIf((_, value) => value)
  refreshToken?: string | null;

  @ApiProperty({
    description: 'Stripe customer id of this user',
    examples: ['cus_NffrFeUfNV2Hib', 'cus_FJANdAJafEQdIq'],
    default: 'cus_NffrFeUfNV2Hib',
  })
  @MaxLength(255)
  @IsString()
  @ValidateIf((_, value) => value)
  stripeCustomerId?: string;

  @ApiProperty({
    description: "User's registration date and time",
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @ValidateIf((_, value) => value)
  registeredAt?: Date;
}
