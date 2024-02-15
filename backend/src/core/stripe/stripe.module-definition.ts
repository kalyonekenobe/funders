import { ConfigurableModuleBuilder } from '@nestjs/common';
import { StripeModuleOptions } from './types/stripe.types';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<StripeModuleOptions>().setClassMethodName('forRoot').build();
