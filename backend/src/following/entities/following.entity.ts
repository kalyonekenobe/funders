import { ApiProperty } from '@nestjs/swagger';
import { Following } from '@prisma/client';
import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';

export class FollowingEntity implements Following {
  @ApiProperty({
    description: "User's uuid",
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  userId: string;

  @ApiProperty({
    description: "Follower's uuid",
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  followerId: string;

  @ApiProperty({ description: 'The nested user object for this following' })
  user?: UserPublicEntity;

  @ApiProperty({ description: 'The nested follower object for this following' })
  follower?: UserPublicEntity;
}
