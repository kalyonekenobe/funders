'use client';

import { useRouter } from 'next/navigation';
import { ButtonHTMLAttributes, FC } from 'react';

export interface BackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const BackButton: FC<BackButtonProps> = ({ children, ...props }) => {
  const router = useRouter();

  return (
    <button
      type='button'
      onClick={async () => {
        await router.back();
        router.refresh();
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default BackButton;
