import { Module } from '@nestjs/common';
import { StripeModule } from '../stripe/stripe.module';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    StripeModule.forRootAsync({
      useFactory: () => ({
        apiKey: process.env.STRIPE_API_KEY,
        options: {
          apiVersion: '2023-10-16',
        },
      }),
    }),
  ],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
