import { AuthProviders } from '@/app/(core)/utils/auth.utils';
import { google } from 'googleapis';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.FRONTEND_URL}/api/auth/google/callback`,
  );

  const { referer } = JSON.parse(request.nextUrl.searchParams.get('state') ?? '');
  const code = request.nextUrl.searchParams.get('code');

  const { tokens } = await oauth2Client.getToken(code || '');
  const { email } = await oauth2Client.getTokenInfo(tokens.access_token || '');

  cookies().set(
    'auth.token',
    sign(
      { provider: AuthProviders.Google, email, accessToken: tokens.access_token, referer },
      process.env.AUTH_SECRET!,
      { expiresIn: '60s' },
    ),
    { httpOnly: true },
  );

  return NextResponse.redirect(referer);
};
