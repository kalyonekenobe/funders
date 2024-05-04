'use client';

import { FC } from 'react';
import { AuthProviders } from '../../utils/auth.utils';
import { DiscordIcon, GoogleIcon } from '../Icons/Icons';
import { authWithSSO } from '../../actions/auth.actions';

export interface SSOAuthenticationButtonsProps {
  providers?: AuthProviders[];
  type: 'sign-in' | 'sign-up';
}

const SSOAuthenticationButtons: FC<SSOAuthenticationButtonsProps> = ({
  providers = Object.values(AuthProviders),
  type,
}) => {
  return (
    <>
      {providers?.includes(AuthProviders.Google) && (
        <button
          type='button'
          className='inline-flex justify-center items-center border rounded-lg p-2.5 font-medium text-gray-500 text-center hover:bg-slate-100 transition-[0.3s_ease]'
          onClick={() => authWithSSO(AuthProviders.Google)}
        >
          <GoogleIcon className='size-5 me-3' />
          Sign {type === 'sign-in' ? 'in' : 'up'} with Google
        </button>
      )}
      {providers?.includes(AuthProviders.Discord) && (
        <button
          type='button'
          className='inline-flex justify-center items-center border rounded-lg p-2.5 font-medium text-gray-500 text-center hover:bg-slate-100 transition-[0.3s_ease]'
          onClick={() => authWithSSO(AuthProviders.Discord)}
        >
          <DiscordIcon className='size-5 me-3' />
          Sign {type === 'sign-in' ? 'in' : 'up'} with Discord
        </button>
      )}
    </>
  );
};

export default SSOAuthenticationButtons;
