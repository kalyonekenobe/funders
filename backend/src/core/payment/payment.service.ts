import { Injectable } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class PaymentService {
  constructor(private readonly stripeService: StripeService) {}
}
