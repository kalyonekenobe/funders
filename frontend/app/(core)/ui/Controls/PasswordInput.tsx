'use client';

import React, { FC, useState } from 'react';
import { ClosedEyeIcon, OpenedEyeIcon } from '../Icons/Icons';

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

const PasswordInput: FC<PasswordInputProps> = props => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);

  return (
    <div className='flex relative w-full'>
      <input
        type={isPasswordVisible ? 'password' : 'text'}
        {...props}
        style={{ paddingRight: 'calc(2.75rem + 3px)' }}
      />
      <div
        className='bg-white absolute inline-flex top-1 bottom-1 right-1 items-center align-center aspect-square cursor-pointer rounded-lg'
        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
      >
        {isPasswordVisible ? (
          <ClosedEyeIcon className='inline-flex size-5 mx-auto' />
        ) : (
          <OpenedEyeIcon className='inline-flex size-5 mx-auto' />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
