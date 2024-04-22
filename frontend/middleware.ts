import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ApplicationRoutes, ProtectedRoutes } from './app/(core)/utils/routes.utils';
import { cookies } from 'next/headers';
import { HttpStatusCode } from 'axios';
import { parseCookieString } from './app/(core)/utils/cookies.utils';
import { User } from './app/(core)/store/types/user.types';

export const middleware = async (request: NextRequest) => {
  if (ProtectedRoutes.includes(request.nextUrl.pathname as ApplicationRoutes)) {
    let authenticatedUser: User | null = null;
    const userExistResponse = NextResponse.next();

    try {
      const fetchUserResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Cookie: cookies().toString(),
        },
      });

      if (fetchUserResponse.status === HttpStatusCode.Unauthorized) {
        const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            Cookie: cookies().toString(),
          },
          body: JSON.stringify({}),
        });

        if (refreshResponse.status !== HttpStatusCode.Created) {
          throw new Error(
            'Cannot update the pair of access and refresh tokens. Invalid refresh token',
          );
        }

        (refreshResponse.headers.get('set-cookie')?.split(', ') ?? []).forEach(cookieString => {
          const { name, value, ...options } = parseCookieString(cookieString);
          userExistResponse.cookies.set(name, value, options);
        });

        const newFetchUserResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              Cookie: userExistResponse.headers.get('set-cookie') || '',
            },
          },
        );

        if (newFetchUserResponse.status === HttpStatusCode.Ok) {
          authenticatedUser = await newFetchUserResponse.json();
        }
      }

      if (fetchUserResponse.status === HttpStatusCode.Ok) {
        authenticatedUser = await fetchUserResponse.json();
      }
    } catch (error) {
      console.log(error);
    }

    if (!authenticatedUser) {
      const response = NextResponse.redirect(
        new URL(ApplicationRoutes.SignIn, request.nextUrl.origin),
      );
      response.cookies
        .delete(process.env.ACCESS_TOKEN_COOKIE_NAME || 'Funders-Access-Token')
        .delete(process.env.REFRESH_TOKEN_COOKIE_NAME || 'Funders-Refresh-Token');

      return response;
    }

    return userExistResponse;
  }
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
