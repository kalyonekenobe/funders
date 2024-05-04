import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { ChargePayload } from '../types/payment.types';
import { ApiProperty } from '@nestjs/swagger';

export class ChargeDto implements ChargePayload {
  @ApiProperty({
    description: 'Payment amount',
    examples: [500, 51.5, 12456],
    default: 500,
  })
  @IsNumber()
  @Min(0.01)
  @IsDefined()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Payment method id',
    examples: ['pm_1Ok9YoEAKvB1yATHkzHmlVp7', 'pm_51fAYoEOfAB14SHHkzOKda1d'],
    default: 'pm_1Ok9YoEAKvB1yATHkzHmlVp7',
  })
  @MaxLength(255)
  @IsString()
  @ValidateIf((_, value) => value)
  paymentMethodId?: string;

  @ApiProperty({
    description: 'Payment customer id',
    examples: ['cus_PxzyFC8T5d278r', 'cus_Py03VZ0yQbGDFA'],
    default: 'cus_PxzyFC8T5d278r',
  })
  @MaxLength(255)
  @IsString()
  @ValidateIf((_, value) => value)
  customerId?: string;
}
