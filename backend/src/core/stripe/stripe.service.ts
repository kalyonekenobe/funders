import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { MODULE_OPTIONS_TOKEN } from './stripe.module-definition';
import { StripeModuleOptions } from './types/stripe.types';

@Injectable()
export class StripeService {
  public readonly stripe: Stripe;
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private options: StripeModuleOptions) {
    this.stripe = new Stripe(this.options.apiKey ?? '', this.options.options);
  }
}
