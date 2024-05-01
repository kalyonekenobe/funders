import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { Transform } from 'class-transformer';
import { IsDecimal, IsDefined, IsNotEmpty, IsString, Validate } from 'class-validator';
import { DecimalMin } from 'src/core/validation/decorators/decimal-min.decorator';
import { PostDonationEntity } from '../entities/post-donation.entity';

export class CreatePostDonationDto
  implements Omit<PostDonationEntity, 'id' | 'postId' | 'datetime'>
{
  @ApiProperty({
    description: 'The payment info of the post donation',
    examples: ['{ "last4": "4242" }', '{ "last4": "5167" }', '{ "last4": "9914" }'],
    default: '{ "last4": "4242" }',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  paymentInfo: string;

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
