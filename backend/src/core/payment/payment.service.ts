import { Injectable } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import Stripe from 'stripe';
import { PaymentChargeResponse, PaymentListResponse } from './types/payment.types';

@Injectable()
export class PaymentService {
  constructor(private readonly stripeService: StripeService) {}

  async createCustomer(name: string, email: string): Promise<Stripe.Response<Stripe.Customer>> {
    return this.stripeService.stripe.customers.create({ name, email });
  }

  async charge(customerId: string, amount: number): Promise<PaymentChargeResponse> {
    try {
      const paymentIntent = await this.stripeService.stripe.paymentIntents.create({
        amount: amount * 100,
        customer: customerId,
        currency: process.env.STRIPE_CURRENCY ?? 'USD',
        automatic_payment_methods: { enabled: false },
        payment_method_types: ['card'],
      });

      return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async addCustomerCard(
    paymentMethodId: string,
    customerId: string,
  ): Promise<Stripe.Response<Stripe.SetupIntent>> {
    return this.stripeService.stripe.setupIntents.create({
      customer: customerId,
      payment_method: paymentMethodId,
    });
  }

  async getCustomerCards(customerId: string): Promise<PaymentListResponse[]> {
    const { data } = await this.stripeService.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return data.map(item => {
      if (!item.card) {
        throw new Error('Cannot get the list of customer cards!');
      }

      return { ...item.card, id: item.id };
    });
  }

  async deleteCustomerCard(cardId: string): Promise<Stripe.Response<Stripe.PaymentMethod>> {
    return this.stripeService.stripe.paymentMethods.detach(cardId);
  }
}
