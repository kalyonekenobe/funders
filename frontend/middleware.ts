import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ApplicationRoutes, ProtectedRoutes } from './app/(core)/utils/routes.utils';
import { headers } from 'next/headers';
import { HttpStatusCode } from 'axios';
import { parseCookieString } from './app/(core)/utils/cookies.utils';
import { User } from './app/(core)/store/types/user.types';

export const middleware = async (request: NextRequest) => {
  if (ProtectedRoutes.includes(request.nextUrl.pathname as ApplicationRoutes)) {
    let authenticatedUser: User | null = null;
    const userExistResponse = NextResponse.next();

    try {
      let response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user`, {
        method: 'GET',
        credentials: 'include',
        headers: headers(),
      });

      if (response.status === HttpStatusCode.Unauthorized) {
        response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: headers(),
        });

        if (response.status !== HttpStatusCode.Created) {
          throw new Error(
            'Cannot update the pair of access and refresh tokens. Invalid refresh token',
          );
        }

        (response.headers.get('set-cookie')?.split(', ') ?? []).forEach(cookieString => {
          const { name, value, ...options } = parseCookieString(cookieString);
          userExistResponse.cookies.set(name, value, options);
        });

        response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${
              userExistResponse.cookies.get(
                process.env.ACCESS_TOKEN_COOKIE_NAME || 'Funders-Access-Token',
              )?.value || ''
            }`,
            Cookie: userExistResponse.headers.get('set-cookie') || '',
          },
        });
      }

      if (response.status === HttpStatusCode.Ok) {
        authenticatedUser = await response.json();
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
