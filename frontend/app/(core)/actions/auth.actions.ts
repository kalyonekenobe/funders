'use server';

import { ValiError, flatten, parse } from 'valibot';
import { LoginSchema, RegisterSchema } from '../validation/schemas/auth/auth.schema';
import axios from '@/app/(core)/utils/axios.utils';
import { HttpStatusCode } from 'axios';
import { AuthProviders } from '../utils/auth.utils';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import { ApplicationRoutes } from '../utils/routes.utils';
import { applySetRequestCookies, capitalize } from '../utils/app.utils';
import { UserRoleEnum } from '../store/types/user-role.types';
import { UserRegistrationMethodEnum } from '../store/types/user-registration-method.types';
import { parseCookieString } from '../utils/cookies.utils';
import { NextRequest, NextResponse } from 'next/server';
import { AuthInfo } from '../store/types/app.types';

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
          global:
            'The provided credentials are invalid. Please verify your email and password and try again.',
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

    if (registrationMethod && registrationMethod !== UserRegistrationMethodEnum.Default) {
      delete data.password;
    }

    if (
      confirmPassword !== data.password &&
      registrationMethod === UserRegistrationMethodEnum.Default
    ) {
      throw new ValiError([
        { reason: 'any', context: '', input: '', expected: '', received: '', message: '' },
      ]);
    }

    const response = await axios.post('/auth/register', {
      ...user,
      registrationMethod,
      role: UserRoleEnum.Default,
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

  const payload = await jose.decodeJwt(authTokenCookie.value);
  const authTokenIsValid = await jose.jwtVerify(
    authTokenCookie.value,
    new TextEncoder().encode(process.env.AUTH_SECRET!),
  );

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
    const response = await axios.get(`/users?where[email]=${email}`);

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error('Internal server error');
    }

    if (!response.data.length) {
      cookies().set(
        'auth.account-completion-token',
        await new jose.SignJWT({ email, provider, referer })
          .setProtectedHeader({ alg: 'HS256' })
          .sign(new TextEncoder().encode(process.env.AUTH_SECRET!)),
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

  const payload = (await jose.decodeJwt(accountCompletionToken.value)) as { [key: string]: any };
  const accountCompletionTokenIsValid = await jose.jwtVerify(
    accountCompletionToken.value,
    new TextEncoder().encode(process.env.AUTH_SECRET!),
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

export const getAuthInfo = async (): Promise<AuthInfo | null> => {
  const payload = (await jose.decodeJwt(
    cookies().get(process.env.ACCESS_TOKEN_COOKIE_NAME || 'Funders-Access-Token')?.value ?? '',
  )) as { [key: string]: any };

  if (payload && !(typeof payload === 'string')) {
    const { userId, firstName, lastName, permissions, avatar } = payload;
    return { userId, firstName, lastName, permissions, avatar };
  }

  return null;
};

export const signOut = () => {
  cookies().delete(process.env.ACCESS_TOKEN_COOKIE_NAME || 'Funders-Access-Token');
  cookies().delete(process.env.REFRESH_TOKEN_COOKIE_NAME || 'Funders-Refresh-Token');
  return redirect(ApplicationRoutes.SignIn);
};

export const setCookies = (cookiesToUpdate: string[]) => {
  cookiesToUpdate.forEach(cookieString => {
    const { name, value, ...options } = parseCookieString(cookieString);
    cookies().set(name, value, options);
  });
};

export const removeCookies = (cookiesToRemove: string[]) => {
  cookiesToRemove.forEach(cookie => {
    cookies().delete(cookie);
  });
};

export const updateSession = async (request: NextRequest, response: NextResponse) => {
  try {
    let authenticatedUserResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user`,
      {
        method: 'GET',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          Cookie: cookies().toString(),
        },
      },
    );

    if (authenticatedUserResponse.status === HttpStatusCode.Unauthorized) {
      const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          Cookie: cookies().toString(),
        },
      });

      (refreshResponse.headers.getSetCookie()?.[0]?.split(',') ?? []).forEach(cookieString => {
        const { name, value, ...options } = parseCookieString(cookieString);
        response.cookies.set(name, value, options);
      });

      applySetRequestCookies(request, response);

      authenticatedUserResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          Cookie: response.cookies.toString(),
        },
      });
    }

    if (authenticatedUserResponse.status === HttpStatusCode.Ok) {
      return { authenticatedUser: await authenticatedUserResponse.json() };
    }
  } catch (error) {
    console.log(error);
  }

  return { authenticatedUser: null };
};
