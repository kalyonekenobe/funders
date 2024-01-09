import { ApiProperty } from '@nestjs/swagger';
import { PostCategory } from '@prisma/client';
import { IsDefined, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { PostEntity } from 'src/post/entities/post.entity';

export class PostCategoryEntity implements PostCategory {
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

  @ApiProperty({
    description: 'The nested array of posts which have this category',
  })
  posts?: PostEntity[];
}
