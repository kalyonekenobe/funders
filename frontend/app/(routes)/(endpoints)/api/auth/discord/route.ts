import { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const url = `https://discord.com/oauth2/authorize?response_type=code&client_id=${
    process.env.DISCORD_CLIENT_ID
  }&scope=identify&state=${JSON.stringify({
    referer: request.headers.get('referer'),
  })}&redirect_uri=${`${process.env.FRONTEND_URL}/api/auth/discord/callback`}&prompt=consent`;

  return Response.redirect(url);
};
