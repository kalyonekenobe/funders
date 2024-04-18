'use client';

import { FC } from 'react';
import { AuthProviders } from '../../utils/auth.utils';
import { DiscordIcon, GoogleIcon } from '../Icons/Icons';
import { signIn } from 'next-auth/react';

export interface SSOAuthenticationButtonsProps {
  providers?: AuthProviders[];
}

const SSOAuthenticationButtons: FC<SSOAuthenticationButtonsProps> = ({
  providers = Object.values(AuthProviders),
}) => {
  return (
    <>
      {providers?.includes(AuthProviders.Google) && (
        <button
          type='button'
          className='inline-flex justify-center items-center border rounded-lg p-2.5 font-medium text-gray-500 text-center hover:bg-slate-100 transition-[0.3s_ease]'
          onClick={() => signIn(AuthProviders.Google)}
        >
          <GoogleIcon className='size-5 me-3' />
          Sign in with Google
        </button>
      )}
      {providers?.includes(AuthProviders.Discord) && (
        <button
          type='button'
          className='inline-flex justify-center items-center border rounded-lg p-2.5 font-medium text-gray-500 text-center hover:bg-slate-100 transition-[0.3s_ease]'
          onClick={() => signIn(AuthProviders.Discord)}
        >
          <DiscordIcon className='size-5 me-3' />
          Sign in with Discord
        </button>
      )}
    </>
  );
};

export default SSOAuthenticationButtons;
