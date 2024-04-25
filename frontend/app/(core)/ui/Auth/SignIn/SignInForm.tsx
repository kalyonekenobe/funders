'use client';

import { FC, useEffect, useState } from 'react';
import { ApplicationRoutes } from '../../../utils/routes.utils';
import Link from 'next/link';
import SSOAuthenticationButtons from '../SSOAuthenticationButtons';
import PasswordInput from '../../Controls/PasswordInput';
import { authWithSSOIfAuthTokenExist, signIn } from '@/app/(core)/actions/auth.actions';
import { useRouter } from 'next/navigation';
import useNotification from '@/app/(core)/hooks/notifications.hooks';
import { NotificationType } from '@/app/(core)/utils/notifications.utils';
import { HttpStatusCode } from 'axios';

export interface SignInFormProps {}
export interface SignInFormState {
  isLoaded: boolean;
  errors: any;
}

const initialState: SignInFormState = {
  isLoaded: false,
  errors: {},
};

const SignInForm: FC<SignInFormProps> = () => {
  const { createNotification } = useNotification();
  const [state, setState] = useState(initialState);
  const router = useRouter();

  const submit = async (formData: FormData) => {
    const response = await signIn(state, formData);
    setState(response);

    if (response.errors.global) {
      createNotification({
        type: NotificationType.Error,
        message: response.errors.global,
      });
    }

    if (!response.errors.global && !response.errors.nested) {
      createNotification({
        type: NotificationType.Success,
        message: 'The user was successfully authorized',
      });
      router.push(ApplicationRoutes.Home);
    }
  };

  useEffect(() => {
    setState({ ...state, isLoaded: true });
  }, []);

  useEffect(() => {
    if (state.isLoaded) {
      const request = async () => {
        const response = await authWithSSOIfAuthTokenExist();

        if (response.notify) {
          const type =
            response.status === HttpStatusCode.Created
              ? NotificationType.Success
              : NotificationType.Error;
          const message =
            response.status === HttpStatusCode.Created
              ? response.data.message || 'The user was successfully authorized'
              : response.data.error || 'Cannot authorize the user due to the server error';

          createNotification({ type, message });
        }

        if (response.status === HttpStatusCode.TemporaryRedirect) {
          router.push(response.data.redirectUrl || ApplicationRoutes.SignIn);
        }

        if (response.status === HttpStatusCode.Created) {
          router.push(ApplicationRoutes.Home);
        }
      };

      request().catch(console.error);
    }
  }, [state.isLoaded]);

  return (
    <form className='flex flex-col max-w-md w-full p-3' action={submit}>
      <h3 className='text-center font-semibold text-gray-500 text-2xl'>Sign in</h3>
      <div className='flex flex-col mt-5'>
        <div className='flex flex-col gap-y-3'>
          <div className='flex flex-col'>
            <input
              type='email'
              name='email'
              id='sign-in-email'
              placeholder='Email'
              className={`border p-3 rounded-lg text-gray-700 font-medium ${
                state.errors.nested?.email ? `border-red-500` : ``
              }`}
              onChange={() =>
                setState({
                  ...state,
                  errors: {
                    ...state.errors,
                    nested: Object.fromEntries(
                      Object.entries(state.errors.nested ?? {}).filter(
                        ([key, _]) => key !== 'email',
                      ),
                    ),
                  },
                })
              }
            />
            {state.errors.nested?.email?.map((error: string, index: number) => (
              <span key={index} className='text-red-500 text-xs font-medium mt-1 text-justify'>
                {error}
              </span>
            ))}
          </div>
          <div className='flex flex-col'>
            <PasswordInput
              id='sign-in-password'
              name='password'
              placeholder='Password'
              className={`border p-3 rounded-lg text-gray-700 font-medium w-full ${
                state.errors.nested?.password ? `border-red-500` : ``
              }`}
              onChange={() =>
                setState({
                  ...state,
                  errors: {
                    ...state.errors,
                    nested: Object.fromEntries(
                      Object.entries(state.errors.nested ?? {}).filter(
                        ([key, _]) => key !== 'password',
                      ),
                    ),
                  },
                })
              }
            />
            {state.errors.nested?.password?.map((error: string, index: number) => (
              <span key={index} className='text-red-500 text-xs font-medium mt-1 text-justify'>
                {error}
              </span>
            ))}
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
          <SSOAuthenticationButtons type='sign-in' />
        </div>
      </div>
    </form>
  );
};

export default SignInForm;
