'use client';

import { signIn } from 'next-auth/react';
import { FC } from 'react';
import { DiscordIcon, GoogleIcon } from '../Icons/Icons';
import { ApplicationRoutes } from '../../utils/routes.utils';
import Link from 'next/link';

const SignInForm: FC = () => {
  return (
    <form className='flex flex-col max-w-md w-full p-3'>
      <h3 className='text-center font-semibold text-gray-500 text-2xl'>Sign in</h3>
      <div className='flex flex-col mt-5'>
        <div className='flex flex-col gap-y-3'>
          <div className='flex flex-col'>
            <input
              type='email'
              id='sign-in-email'
              placeholder='Email'
              className='border p-3 rounded-lg text-gray-700 font-medium'
            />
          </div>
          <div className='flex flex-col'>
            <input
              type='password'
              id='sign-in-password'
              className='border p-3 rounded-lg text-gray-700 font-medium'
              placeholder='Password'
            />
          </div>
          <div className='flex flex-wrap gap-x-3 justify-between'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='sign-in-remember-me'
                className='me-1 size-3 cursor-pointer'
              />
              <label
                htmlFor='sign-in-remember-me'
                className='text-slate-500 cursor-pointer text-sm select-none font-medium'
              >
                Remember me
              </label>
            </div>
            <span className='text-sm font-medium text-blue-500 cursor-pointer hover:text-blue-700 transition-[0.3s_ease]'>
              Forgot password?
            </span>
          </div>
          <div className='flex flex-col my-2'>
            <button className='rounded-lg p-2.5 bg-pos-0 text-white font-medium bg-red-500 hover:bg-rose-500 transition-[0.3s_ease]'>
              Sign In
            </button>
          </div>
          <div className='flex flex-col items-center'>
            <p className='text-sm'>
              Do not have an account?{' '}
              <Link
                href={ApplicationRoutes.SignUp}
                className='font-medium text-blue-500 cursor-pointer hover:text-blue-700 transition-[0.3s_ease]'
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
        <div className='flex items-center justify-center my-6 h-[2px] bg-slate-200 rounded-lg'>
          <span className='bg-white px-2 rounded-full text-sm text-slate-400 font-medium text-center'>
            OR
          </span>
        </div>
        <div className='flex flex-col gap-y-2'>
          <button
            type='button'
            className='inline-flex justify-center items-center border rounded-lg p-2.5 font-medium text-gray-500 text-center hover:bg-slate-100 transition-[0.3s_ease]'
            onClick={() => signIn('google')}
          >
            <GoogleIcon className='size-5 me-3' />
            Sign in with Google
          </button>
          <button
            type='button'
            className='inline-flex justify-center items-center border rounded-lg p-2.5 font-medium text-gray-500 text-center hover:bg-slate-100 transition-[0.3s_ease]'
            onClick={() => signIn('discord')}
          >
            <DiscordIcon className='size-5 me-3' />
            Sign in with Discord
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignInForm;
