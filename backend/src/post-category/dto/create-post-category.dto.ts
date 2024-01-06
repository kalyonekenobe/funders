import { ApiProperty } from '@nestjs/swagger';
import { PostCategoryEntity } from '../entities/post-category.entity';
import { IsDefined, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreatePostCategoryDto implements PostCategoryEntity {
  @ApiProperty({
    description: 'Name of the post category',
    examples: ['Army', 'Talents', 'Poor people', 'Animals'],
    default: 'Army',
  })
  @Matches(/^[a-zA-Z_0-9 ]+$/)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;
}
