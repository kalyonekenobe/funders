'use client';

import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { FC, FormHTMLAttributes, ForwardedRef, forwardRef } from 'react';
import { Post } from '../../store/types/post.types';
import { PaymentIntentResult, loadStripe } from '@stripe/stripe-js';

export interface PaymentFormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  clientSecret: string;
  post: Post;
  ref: ForwardedRef<HTMLFormElement>;
  onSubmit: (result: PaymentIntentResult) => void;
}

const PaymentForm: FC<PaymentFormProps> = forwardRef(({ post, clientSecret, ...props }, ref) => {
  return (
    <Elements
      stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '')}
      options={{ clientSecret }}
    >
      <PaymentFormContent post={post} {...props} ref={ref} clientSecret={clientSecret} />
    </Elements>
  );
});

const PaymentFormContent: FC<PaymentFormProps> = forwardRef(
  ({ post, children, clientSecret, onSubmit, ...props }, ref: ForwardedRef<HTMLFormElement>) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        if (!stripe || !elements) return;
        const response = await stripe?.confirmPayment({ elements, redirect: 'if_required' });
        onSubmit(response);
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <form onSubmit={handleSubmit} {...props} ref={ref}>
        <PaymentElement />
      </form>
    );
  },
);

export default PaymentForm;
