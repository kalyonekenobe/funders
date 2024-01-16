import { ApiProperty } from '@nestjs/swagger';
import { CategoriesOnPosts } from '@prisma/client';
import { IsDefined, IsNotEmpty, IsString, IsUUID, Matches, MaxLength } from 'class-validator';
import { PostCategoryEntity } from 'src/post-category/entities/post-category.entity';
import { PostEntity } from 'src/post/entities/post.entity';

export class CategoriesOnPostsEntity implements CategoriesOnPosts {
  @ApiProperty({
    description: 'Post uuid',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  postId: string;

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
  category: string;

  @ApiProperty({ description: 'The nested post object for this CategoriesOnPostsEntity' })
  post?: PostEntity;

  @ApiProperty({ description: 'The nested postCategory object for this CategoriesOnPostsEntity' })
  postCategory?: PostCategoryEntity;
}
