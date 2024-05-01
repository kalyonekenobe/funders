import { Module } from '@nestjs/common';
import { StripeModule } from '../stripe/stripe.module';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [
    StripeModule.forRootAsync({
      useFactory: () => ({
        apiKey: process.env.STRIPE_API_KEY,
        options: {
          apiVersion: '2024-04-10',
        },
      }),
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
