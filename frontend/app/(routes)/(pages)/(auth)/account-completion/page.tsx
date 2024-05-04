import AccountCompletionForm from '@/app/(core)/ui/Auth/AccountCompletion/AccountCompletionForm';
import { ApplicationRoutes } from '@/app/(core)/utils/routes.utils';
import { Metadata } from 'next';
import Link from 'next/link';
import { FC } from 'react';

export const metadata: Metadata = {
  title: 'Account Completion | Funders',
  description: 'Funders - Account Completion',
};

const AccountCompletionPage: FC = async () => {
  return (
    <main className='flex h-screen'>
      <section className='inline-flex flex-col p-2 md:p-10 items-center justify-center flex-1 bg-white'>
        <AccountCompletionForm />
      </section>
      <section className='hidden lg:inline-flex flex-col p-10 items-center justify-center flex-1 bg-gradient-to-br from-red-500 via-rose-600 to-red-500'>
        <h2 className='text-white font-bold text-6xl text-center'>Hello, friend!</h2>
        <p className='text-white text-center my-14 text-lg max-w-2xl'>
          We welcome you to our platform for volunteer fundraising. Here you can find a huge number
          of fundraisings you can donate to, as well as create your own fundraisings. Join our
          platform now and help make the world a better place!
        </p>
        <Link
          href={ApplicationRoutes.SignIn}
          className='text-white font-medium border-2 px-10 py-2 rounded-lg hover:text-gray-500 hover:border-transparent hover:bg-white transition-[0.3s_ease]'
        >
          Sign in to your account
        </Link>
      </section>
    </main>
  );
};

export default AccountCompletionPage;
