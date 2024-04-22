import { AuthProviders } from '@/app/(core)/utils/auth.utils';
import axios from 'axios';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const { referer } = JSON.parse(request.nextUrl.searchParams.get('state') ?? '');
  const code = request.nextUrl.searchParams.get('code');

  const tokenResponse = await axios.post(
    'https://discord.com/api/oauth2/token',
    new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID || '',
      client_secret: process.env.DISCORD_CLIENT_SECRET || '',
      grant_type: 'authorization_code',
      redirect_uri: `${process.env.FRONTEND_URL}/api/auth/discord/callback` || '',
      code: code || '',
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  const { access_token } = tokenResponse.data;

  const userResponse = await axios.get('https://discordapp.com/api/users/@me', {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  const { email } = userResponse.data;

  cookies().set(
    'auth.token',
    sign(
      { provider: AuthProviders.Discord, email, accessToken: access_token, referer },
      process.env.AUTH_SECRET!,
      { expiresIn: '60s' },
    ),
    { httpOnly: true },
  );

  return NextResponse.redirect(referer);
};
