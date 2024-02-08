import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { Transform } from 'class-transformer';
import {
  IsDecimal,
  IsDefined,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  Validate,
} from 'class-validator';
import { DecimalMin } from 'src/core/validation/decorators/decimal-min.decorator';
import { PostDonationEntity } from '../entities/post-donation.entity';

export class CreatePostDonationDto
  implements Omit<PostDonationEntity, 'id' | 'postId' | 'datetime'>
{
  @ApiProperty({
    description: 'The card number of donater of the post donation',
    examples: ['1234567890987654', '5594148605144157', '9684037525861053'],
    default: '5594148605144157',
  })
  @Matches(/^\d{16}$/gu)
  @MaxLength(16)
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  cardNumber: string;

  @ApiProperty({
    description: 'The amount of money of the donation',
    examples: [1551.6, 1000.0, 8500.5],
    default: 8500.5,
  })
  @Transform(value => new Decimal(value.value))
  @Validate(DecimalMin, [0.01])
  @IsDecimal()
  @IsDefined()
  @Transform(value => value.value.toString())
  donation: Decimal;
}
