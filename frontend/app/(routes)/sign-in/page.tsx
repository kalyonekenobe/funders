import { Metadata } from 'next';
import { FC } from 'react';
import SignInForm from '@/app/(core)/ui/SignInForm/SignInForm';

export const metadata: Metadata = {
  title: 'Funders | Sign In',
  description: 'Funders - Sign In',
};

const SignIn: FC = async () => {
  return (
    <main className='flex items-center h-screen'>
      <section className='flex w-1/2 flex-1 h-full'>
        <SignInForm />
      </section>
      <section className='flex w-1/2 flex-1 bg-[linear-gradient(to_right,_#ff4b2b,_#ff416c)] h-full'></section>
    </main>
  );
};

export default SignIn;
