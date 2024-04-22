'use server';

import { ValiError, flatten, parse } from 'valibot';
import { LoginSchema, RegisterSchema } from '../validation/schemas/auth/auth.schema';
import axios from '@/app/(core)/utils/axios.utils';
import { HttpStatusCode } from 'axios';
import { AuthProviders } from '../utils/auth.utils';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { JwtPayload, decode, sign, verify } from 'jsonwebtoken';
import { ApplicationRoutes } from '../utils/routes.utils';
import { capitalize } from '../utils/app.utils';
import { User } from '../store/types/user.types';
import { UserRole } from '../store/types/user-role.types';
import { RegistrationMethod } from '../store/types/registration-method.types';

export const signIn = async (state: any, formData: FormData) => {
  try {
    const { email, password } = Object.fromEntries(formData);
    const credentials = await parse(LoginSchema, { email, password });

    const response = await axios.post('/auth/login', credentials);

    if (response.status === HttpStatusCode.Created) {
      return { ...state, errors: {} };
    }
  } catch (error: any) {
    if (error instanceof ValiError) {
      return {
        ...state,
        errors: flatten(error),
      };
    }

    if (error.response?.status === HttpStatusCode.Unauthorized) {
      return {
        errors: {
          ...state,
          global: error.response?.data?.message ?? 'Internal server error.',
        },
      };
    }
  }

  return {
    errors: {
      ...state,
      global: 'Internal server error.',
    },
  };
};

export const signUp = async (state: any, formData: FormData) => {
  const { ACTION_ID, registrationMethod, confirmPassword, ...data } = Object.fromEntries(
    formData,
  ) as any;
  try {
    if (!data.password) {
      data.password = '#xxxxxx0';
    }

    data.birthDate = new Date(data.birthDate);
    const user = await parse(RegisterSchema, data);

    if (registrationMethod && registrationMethod !== RegistrationMethod.Default) {
      delete data.password;
    }

    if (confirmPassword !== data.password && registrationMethod === RegistrationMethod.Default) {
      throw new ValiError([
        { reason: 'any', context: '', input: '', expected: '', received: '', message: '' },
      ]);
    }

    const response = await axios.post('/auth/register', {
      ...user,
      registrationMethod,
      role: UserRole.Default,
    });

    if (response.status === HttpStatusCode.Created) {
      return { ...state, errors: {} };
    }
  } catch (error: any) {
    if (error instanceof ValiError) {
      if (confirmPassword !== data.password) {
        error.issues = [
          ...error.issues,
          {
            reason: 'any',
            context: 'confirm_password',
            input: confirmPassword,
            expected: data.password,
            received: confirmPassword,
            message: 'Passwords are different.',
            path: [
              {
                type: 'object',
                origin: 'value',
                input: confirmPassword,
                key: 'confirmPassword',
                value: confirmPassword,
              },
            ],
          },
        ].filter(issue => issue.context !== '') as any;
      }

      return {
        ...state,
        errors: flatten(error),
      };
    }

    if (
      error.response?.status === HttpStatusCode.Conflict &&
      error.response.data?.message?.includes('email')
    ) {
      return {
        ...state,
        errors: {
          global: 'The user with such email already exists.',
        },
      };
    }

    if (error.response?.status === HttpStatusCode.Unauthorized) {
      return {
        ...state,
        errors: {
          global: error.response?.data?.message ?? 'Internal server error.',
        },
      };
    }
  }

  return {
    ...state,
    errors: {
      global: 'Internal server error.',
    },
  };
};

export const authWithSSO = async (provider: AuthProviders) => {
  return redirect(`/api/auth/${provider}`);
};

export const authWithSSOIfAuthTokenExist = async (): Promise<{
  notify: boolean;
  data: any;
  status: HttpStatusCode;
}> => {
  const authTokenCookie = cookies().get('auth.token');

  if (!authTokenCookie) {
    return {
      notify: false,
      data: { error: 'The auth token is missing' },
      status: HttpStatusCode.Unauthorized,
    };
  }

  const payload = decode(authTokenCookie.value) as JwtPayload;
  const authTokenIsValid = verify(authTokenCookie.value, process.env.AUTH_SECRET!, {
    ignoreExpiration: false,
  });

  cookies().delete('auth.token');

  if (!authTokenIsValid || !payload) {
    return {
      notify: true,
      data: { error: 'The auth token is invalid or expired' },
      status: HttpStatusCode.Unauthorized,
    };
  }

  const { email, provider, accessToken, referer } = payload;

  try {
    const response = await axios.get(`/users?email=${email}`);

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error('Internal server error');
    }

    if (!response.data.length) {
      cookies().set(
        'auth.account-completion-token',
        sign({ email, provider, referer }, process.env.AUTH_SECRET!),
        {
          httpOnly: true,
        },
      );

      return {
        notify: false,
        data: {
          error:
            'The user with such email is not registered. Please, complete the registration process',
          redirectUrl: `${process.env.FRONTEND_URL}/${ApplicationRoutes.AccountCompletion}`,
        },
        status: HttpStatusCode.TemporaryRedirect,
      };
    } else {
      await axios.post(`/auth/login/${provider}`, undefined, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
  } catch (error: any) {
    return { notify: true, data: { error: error.toString() }, status: HttpStatusCode.Unauthorized };
  }

  return {
    notify: true,
    data: { message: 'The user was successfully authorized' },
    status: HttpStatusCode.Created,
  };
};

export const extractAccountCompletionMetadata = async (): Promise<{
  notify: boolean;
  data: any;
  status: HttpStatusCode;
}> => {
  const accountCompletionToken = cookies().get('auth.account-completion-token');

  if (!accountCompletionToken) {
    return {
      notify: true,
      data: {
        error: 'The account completion token is missing',
        redirectUrl: `${process.env.FRONTEND_URL}/${ApplicationRoutes.SignIn}`,
      },
      status: HttpStatusCode.TemporaryRedirect,
    };
  }

  const payload = decode(accountCompletionToken.value) as JwtPayload;
  const accountCompletionTokenIsValid = verify(
    accountCompletionToken.value,
    process.env.AUTH_SECRET!,
    {
      ignoreExpiration: false,
    },
  );

  cookies().delete('auth.account-completion-token');

  if (!accountCompletionTokenIsValid || !payload) {
    return {
      notify: true,
      data: {
        error: 'The account completion token is invalid or expired',
        redirectUrl: `${process.env.FRONTEND_URL}/${ApplicationRoutes.SignIn}`,
      },
      status: HttpStatusCode.TemporaryRedirect,
    };
  }

  const { email, provider, referer } = payload;

  if (!email || !provider) {
    return {
      notify: true,
      data: {
        error: `An error occurred when receiving data from ${capitalize(
          provider ?? 'auth provider',
        )}`,
        redirectUrl: referer,
      },
      status: HttpStatusCode.TemporaryRedirect,
    };
  }

  return {
    notify: false,
    data: { email, provider },
    status: HttpStatusCode.Created,
  };
};

export const getAuthenticatedUser = async (): Promise<User | null> => {
  try {
    const response = await axios.get(`/auth/user`);
    return response.data;
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const signOut = () => {
  cookies().delete(process.env.ACCESS_TOKEN_COOKIE_NAME || 'Funders-Access-Token');
  cookies().delete(process.env.REFRESH_TOKEN_COOKIE_NAME || 'Funders-Refresh-Token');
  return redirect(ApplicationRoutes.SignIn);
};
