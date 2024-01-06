import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { UserReactionTypeEntity } from '../entities/user-reaction-type.entity';

export class UpdateUserReactionTypeDto implements UserReactionTypeEntity {
  @ApiProperty({
    description: 'Name of the user reaction type',
    examples: ['Like', 'Dislike', 'Heart', 'Anger', 'Crying', 'Laugh'],
    default: 'Like',
  })
  @Matches(/^[a-zA-Z_0-9]+$/)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;
}
