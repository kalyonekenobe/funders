import Stripe from 'stripe';

export interface PaymentChargeResponse {
  clientSecret: string | null;
  id: string;
}

export type PaymentListResponse = Stripe.PaymentMethod.Card & {
  id: string;
};

export interface UpdateCustomerPayload {
  name?: string;
  email?: string;
}

export interface ChargePayload {
  amount: number;
  paymentMethodId?: string;
  customerId?: string;
}
