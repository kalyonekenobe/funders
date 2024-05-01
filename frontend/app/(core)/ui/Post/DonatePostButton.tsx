'use client';

import { ButtonHTMLAttributes, FC, useState } from 'react';
import { Post } from '../../store/types/post.types';
import { createPortal } from 'react-dom';
import PaymentModal from '../Payment/PaymentModal';

export interface DonatePostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  post: Post;
}

export interface DonatePostButtonState {
  isPaymentModalVisible: boolean;
}

const initialState: DonatePostButtonState = {
  isPaymentModalVisible: false,
};

const DonatePostButton: FC<DonatePostButtonProps> = ({ post, children, ...props }) => {
  const [state, setState] = useState(initialState);

  return (
    <>
      {state.isPaymentModalVisible &&
        createPortal(
          <PaymentModal
            post={post}
            title={'Make a donation'}
            onClose={() => setState({ ...state, isPaymentModalVisible: false })}
          />,
          document.querySelector('body')!,
        )}
      <button
        type='button'
        {...props}
        onClick={() => setState({ ...state, isPaymentModalVisible: true })}
      >
        {children}
      </button>
    </>
  );
};

export default DonatePostButton;
