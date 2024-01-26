import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import {
  IsBoolean,
  IsDecimal,
  IsDefined,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { PostEntity } from '../entities/post.entity';
import { Transform } from 'class-transformer';
import { DecimalMin } from 'src/core/validation/decorators/decimal-min.decorator';
import { CreatePostAttachmentDto } from 'src/post-attachment/dto/create-post-attachment.dto';

type CreatePost = Omit<
  PostEntity,
  'id' | 'createdAt' | 'updatedAt' | 'removedAt' | 'attachments'
> & { attachments?: Omit<CreatePostAttachmentDto, 'postId'>[] };

export class CreatePostDto implements CreatePost {
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
  @Transform(value => Number(value.value))
  @Validate(DecimalMin, [0.01])
  @IsDecimal()
  @IsDefined()
  @Transform(value => value.value.toString())
  fundsToBeRaised: Decimal;

  @ApiProperty({ description: 'The image of the post' })
  @ValidateIf((_, value) => value)
  image: Buffer | null;

  @ApiProperty({
    description: 'Is the post draft',
    examples: [false, true],
    default: false,
  })
  @IsBoolean()
  @IsDefined()
  isDraft: boolean;

  @ApiProperty({ description: 'The nested array of attachments of this post' })
  @ValidateIf((_, value) => value)
  attachments?: Omit<CreatePostAttachmentDto, 'postId'>[];
}
