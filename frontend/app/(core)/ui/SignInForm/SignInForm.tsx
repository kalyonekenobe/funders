'use client';

import { signIn } from 'next-auth/react';
import { FC } from 'react';

const SignInForm: FC = () => {
  return (
    <form className=' max-w-md w-full'>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
      <button onClick={() => signIn('discord')}>Sign in with Discord</button>
    </form>
  );
};

export default SignInForm;
