import { FC, useRef, useState } from 'react';
import Modal, { ModalProps } from '../Modal/Modal';
import { Post } from '../../store/types/post.types';
import { createPaymentCharge, donate } from '../../actions/post.actions';
import useNotification from '../../hooks/notifications.hooks';
import { NotificationType } from '../../utils/notifications.utils';
import PaymentForm from './PaymentForm';
import { PaymentIntentResult } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';

export interface PaymentModalProps extends ModalProps {
  post: Post;
  onClose: () => void;
}

export interface PaymentModalState {
  stage: number;
  amount?: number;
  clientSecret: string;
  isLoading: boolean;
  errors: {
    amount?: string;
  };
}

const initialState: PaymentModalState = {
  stage: 1,
  errors: {},
  clientSecret: '',
  isLoading: false,
};

const PaymentModal: FC<PaymentModalProps> = ({ post, children, onClose, ...props }) => {
  const [state, setState] = useState(initialState);
  const { createNotification } = useNotification();
  const router = useRouter();
  const paymentFormRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (result: PaymentIntentResult) => {
    if (result.error) {
      createNotification({
        type: NotificationType.Error,
        message: 'An error occurred while processing the request. Please, try again later',
      });
    } else {
      const response = await donate(
        post.id,
        result.paymentIntent.amount / 100,
        JSON.stringify(result.paymentIntent),
      );

      if (response.error || !response.data) {
        createNotification({
          type: NotificationType.Error,
          message: 'An error occurred while processing the request. Please, try again later',
        });
      } else {
        createNotification({
          type: NotificationType.Success,
          message: 'The donation was successfully created!',
        });
        router.refresh();
      }
    }

    setState(prevState => ({ ...prevState, isLoading: false }));
    onClose();
  };

  const getButtonsByStage = (stage: number): ModalProps['buttons'] => {
    switch (stage) {
      case 1:
        return [
          {
            type: 'close',
            name: 'Close',
            action: () => onClose(),
          },
          {
            type: 'accept',
            name: 'Continue',
            variant: 'primary',
            disabled: state.isLoading,
            action: async () => {
              if (!state.amount) {
                setState({
                  ...state,
                  errors: { amount: 'The donation amount is not chosen or is less than 0.01 USD' },
                });

                return;
              }

              setState(prevState => ({ ...prevState, isLoading: true }));
              const response = await createPaymentCharge(state.amount);

              if (!response.error && response.data) {
                setState(prevState => ({
                  ...prevState,
                  clientSecret: response.data!.clientSecret,
                  stage: 2,
                }));
              } else {
                createNotification({
                  type: NotificationType.Error,
                  message: response.error ?? 'Cannot proceed the action. Please, try again later',
                });
              }
              setState(prevState => ({ ...prevState, isLoading: false }));
            },
          } as any,
        ];
      case 2:
        return [
          {
            type: 'close',
            name: 'Close',
            action: () => onClose(),
          },
          {
            type: 'accept',
            name: 'Proceed',
            variant: 'primary',
            disabled: state.isLoading,
            action: () => {
              setState(prevState => ({ ...prevState, isLoading: true }));
              if (paymentFormRef.current) {
                paymentFormRef.current.dispatchEvent(
                  new Event('submit', { cancelable: true, bubbles: true }),
                );
              } else {
                createNotification({
                  type: NotificationType.Error,
                  message: 'Cannot submit the form. Please, try again later',
                });
                setState(prevState => ({ ...prevState, isLoading: false }));
              }
            },
          } as any,
        ];
      default:
        return [];
    }
  };

  return (
    <Modal {...props} buttons={getButtonsByStage(state.stage)} className='max-w-xl'>
      {state.stage === 1 && (
        <div className='flex flex-col p-5'>
          <h3 className='font-bold text-gray-600'>Step 1: Choose the donation amount</h3>
          <p className='text-sm text-gray-500 mt-1 mb-3'>
            Choose the amount of money you would like to donate to the current post (in USD)
          </p>
          <label htmlFor='payment-amout' className='text-gray-500 text-sm font-medium mb-0.5'>
            Amount (USD):
          </label>
          <input
            type='number'
            placeholder='100'
            id='payment-amount'
            min={0.01}
            step={0.01}
            defaultValue={undefined}
            onChange={event =>
              setState({
                ...state,
                amount: event.target.value ? Number(event.target.value) : undefined,
                errors: Object.fromEntries(
                  Object.entries(state.errors).filter(([key, _]) => key !== 'amount'),
                ),
              })
            }
            className={`p-2 border rounded-lg font-medium text-gray-700 ${
              state.errors.amount ? 'border-red-500' : ''
            }`}
          />
          {state.errors.amount && (
            <span className='text-xs text-red-500 mt-1 font-medium'>{state.errors.amount}</span>
          )}
        </div>
      )}
      {state.stage === 2 && (
        <div className='flex flex-col p-5'>
          <h3 className='font-bold text-gray-600'>
            Step 2: Choose the payment method and fill out required fields
          </h3>
          <p className='text-sm text-gray-500 mt-1 mb-3'>
            Fill out the form with payment method details to make a donation
          </p>
          <PaymentForm
            clientSecret={state.clientSecret}
            post={post}
            ref={paymentFormRef}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </Modal>
  );
};

export default PaymentModal;
