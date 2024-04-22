import { google } from 'googleapis';
import { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.FRONTEND_URL}/api/auth/google/callback`,
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    prompt: 'consent',
    state: `${JSON.stringify({ referer: request.headers.get('referer') })}`,
  });

  return Response.redirect(url);
};
