import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @ApiProperty({
    description: 'Refresh token',
    examples: [
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZWEyYTc0OS05OWE0LTQ1NWEtYTE5NS02YjE4ZDVkNTlmMzEiLCJwZXJtaXNzaW9ucyI6MCwiaWF0IjoxNzEyOTUxODQ0LCJleHAiOjE3MTI5NTI3NDR9.hxA_et0_uQ9AfG8hNCQmc7tzRxYve-dX0oeRbyAJAJM',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZWEyYTc0OS05OWE0LTQ1NWEtYTE5NS02YjE4ZDVkNTlmMzEiLCJwZXJtaXNzaW9ucyI6MCwiaWF0IjoxNzEyOTUyMTE1LCJleHAiOjE3MTMwMzg1MTV9.uJUj6RDmQ7BAO_zxTyIB_J0287myih_0S2r9tE2e4rA',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZWEyYTc0OS05OWE0LTQ1NWEtYTE5NS02YjE4ZDVkNTlmMzEiLCJwZXJtaXNzaW9ucyI6MCwiaWF0IjoxNzEyOTUyMTE1LCJleHAiOjE3MTI5NTMwMTV9.GrD5ysqJy7kNPT9ldqylAr7-R6BY36rNcVkuFXmm3x8',
    ],
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZWEyYTc0OS05OWE0LTQ1NWEtYTE5NS02YjE4ZDVkNTlmMzEiLCJwZXJtaXNzaW9ucyI6MCwiaWF0IjoxNzEyOTUyMTE1LCJleHAiOjE3MTI5NTMwMTV9.GrD5ysqJy7kNPT9ldqylAr7-R6BY36rNcVkuFXmm3x8',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  refreshToken: string;
}
