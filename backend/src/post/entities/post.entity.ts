import { ApiProperty } from '@nestjs/swagger';
import { Post } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDecimal,
  IsDefined,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MaxDate,
  MaxLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { CategoriesOnPostsEntity } from 'src/categories-on-posts/entities/categories-on-posts.entity';
import { DecimalMin } from 'src/core/validation/decorators/decimal-min.decorator';
import { PostAttachmentEntity } from 'src/post-attachment/entities/post-attachment.entity';
import { PostCommentEntity } from 'src/post-comment/entities/post-comment.entity';
import { PostDonationEntity } from 'src/post-donation/entities/post-donation.entity';
import { PostReactionEntity } from 'src/post-reaction/entities/post-reaction.entity';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';

export class PostEntity implements Post {
  @ApiProperty({
    description: 'Post uuid',
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: '989d32c2-abd4-43d3-a420-ee175ae16b98',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  id: string;

  @ApiProperty({
    description: "Post author's uuid",
    examples: ['b7af9cd4-5533-4737-862b-78bce985c987', '989d32c2-abd4-43d3-a420-ee175ae16b98'],
    default: 'b7af9cd4-5533-4737-862b-78bce985c987',
  })
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  authorId: string;

  @ApiProperty({
    description: 'The title of the post',
    examples: [
      'Fundraising for the needs of the 95th Brigade of the Armed Forces of Ukraine',
      'Fundraising for a tank for the 12th Brigade of the Azov National Guard of Ukraine',
      'Fundraising for children and homeless people',
      'Raising funds for animals in the shelter',
    ],
    default: 'Fundraising for the needs of the 95th Brigade of the Armed Forces of Ukraine',
  })
  @Matches(/^[\p{Letter}\p{Mark}\-!?\.,:@#№$;%^&*()_+="'`/\\{}\[\]|~\d\s]+$/gu)
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  title: string;

  @ApiProperty({
    description: 'The content of the post',
    examples: [
      "Title: Giving Hope: Fundraising for Children & the Homeless Fundraising for children and the homeless is a lifeline of hope. Your support provides essentials like education, healthcare, and shelter, shaping brighter futures. Join the cause, be a beacon of compassion. Even a small donation makes a big difference. Together, let's uplift lives and bring hope to those in need.",
      "Title: Supporting Shelter Animals: Fundraising for Their Care Animals in shelters await our support and care. Raising funds for these furry friends means providing food, shelter, and medical aid they desperately need. Your contribution directly impacts their well-being. Even a small donation helps offer comfort and a chance for a loving home. Let's stand together for these voiceless beings. Join the cause to ensure they receive the care they deserve. Your kindness matters in making a difference in their lives.",
      'Title: Empowering Young Talents: Fundraising for Aspiring Minds Supporting young talents is an investment in the future. Raising funds for budding artists, scholars, and innovators paves the way for their dreams to flourish. Your contribution fuels their aspirations. Every donation nurtures their potential, enabling them to pursue their passions and make a positive impact. Join the movement to empower these promising minds. Your support fosters creativity, education, and innovation, shaping a brighter tomorrow for our world.',
      "Title: Supporting Ukraine's 12th Brigade: Fundraising for a Tank Ukraine's 12th Brigade of the Azov National Guard requires a critical asset — a tank. This fundraising effort aims to provide essential armored support to bolster their defense. Your contribution directly enhances the brigade's defensive capabilities, aiding them in protecting the nation's sovereignty. Join us in empowering these courageous soldiers with the resources they urgently need. Stand united with Ukraine's 12th Brigade. Contribute today to support their vital mission in safeguarding the country. Every donation makes a difference in fortifying their defense.",
    ],
    default:
      "Title: Supporting Ukraine's 12th Brigade: Fundraising for a Tank Ukraine's 12th Brigade of the Azov National Guard requires a critical asset — a tank. This fundraising effort aims to provide essential armored support to bolster their defense. Your contribution directly enhances the brigade's defensive capabilities, aiding them in protecting the nation's sovereignty. Join us in empowering these courageous soldiers with the resources they urgently need. Stand united with Ukraine's 12th Brigade. Contribute today to support their vital mission in safeguarding the country. Every donation makes a difference in fortifying their defense.",
  })
  @Matches(/^[\p{Letter}\p{Mark}\-!?\.,:@#№$;%^&*()_+="'`/\\{}\[\]|~\d\s]+$/gu)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  content: string;

  @ApiProperty({
    description: 'Post funds to be raised',
    examples: [10000.5, 1234.41, 8950],
    default: 8950,
  })
  @Transform(value => new Decimal(value.value))
  @Validate(DecimalMin, [0.01])
  @IsDecimal()
  @IsDefined()
  fundsToBeRaised: Decimal;

  @ApiProperty({ description: 'The image path of the post' })
  @IsString()
  @MaxLength(255)
  @ValidateIf((_, value) => value)
  image: string | null;

  @ApiProperty({
    description: 'Is the post draft',
    examples: [false, true],
    default: false,
  })
  @IsBoolean()
  @IsDefined()
  isDraft: boolean;

  @ApiProperty({
    description: 'The date and time the post was created',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2023-06-30'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the post was updated',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2023-11-02'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  updatedAt: Date | null;

  @ApiProperty({
    description: 'The date and time the post was removed',
    examples: [new Date('2024-01-03'), new Date('2023-11-02'), new Date('2023-06-30')],
    default: new Date('2024-01-03'),
  })
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  @IsDefined()
  removedAt: Date | null;

  @ApiProperty({ description: 'The nested author object of this post' })
  author?: UserPublicEntity;

  @ApiProperty({ description: 'The nested array of categories of this post' })
  categories?: CategoriesOnPostsEntity[];

  @ApiProperty({ description: 'The nested array of attachments of this post' })
  attachments?: PostAttachmentEntity[];

  @ApiProperty({ description: 'The nested array of donations of this post' })
  donations?: PostDonationEntity[];

  @ApiProperty({ description: 'The nested array of reactions of this post' })
  reactions?: PostReactionEntity[];

  @ApiProperty({ description: 'The nested array of comments of this post' })
  comments?: PostCommentEntity[];
}
