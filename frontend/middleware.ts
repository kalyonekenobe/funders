import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ApplicationRoutes, ProtectedRoutes } from './app/(core)/utils/routes.utils';
import { updateSession } from './app/(core)/actions/auth.actions';
import { applySetRequestCookies } from './app/(core)/utils/app.utils';

export const middleware = async (request: NextRequest) => {
  const response = NextResponse.next({
    headers: {
      'x-pathname': request.nextUrl.pathname,
      'Cache-Control': 'no-cache',
    },
  });

  if (request.nextUrl.pathname === ApplicationRoutes.Root) {
    return NextResponse.redirect(new URL(ApplicationRoutes.Home, request.nextUrl.origin));
  }

  const { authenticatedUser } = await updateSession(request, response);

  if (
    ProtectedRoutes.includes(request.nextUrl.pathname as ApplicationRoutes) ||
    ProtectedRoutes.find(route => request.nextUrl.pathname.startsWith(route))
  ) {
    if (!authenticatedUser) {
      const notAuthenticatedResponse = NextResponse.redirect(
        new URL(ApplicationRoutes.SignIn, request.nextUrl.origin),
      );
      notAuthenticatedResponse.cookies.delete(
        process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'Funders-Access-Token',
      );
      notAuthenticatedResponse.cookies.delete(
        process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'Funders-Refresh-Token',
      );
      applySetRequestCookies(request, notAuthenticatedResponse);
      return notAuthenticatedResponse;
    }
  }

  return response;
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
