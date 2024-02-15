import Stripe from 'stripe';

export interface PaymentChargeResponse {
  clientSecret: string | null;
  id: string;
}

export type PaymentListResponse = Stripe.PaymentMethod.Card & {
  id: string;
};
