import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import axios from '@/app/(core)/utils/axios.utils';
import { cookies } from 'next/headers';
import { parseCookieString } from '@/app/(core)/utils/cookies.utils';
import { ApplicationRoutes } from '@/app/(core)/utils/routes.utils';
import { AuthProviders } from '@/app/(core)/utils/auth.utils';
import { HttpStatusCode } from 'axios';

export const authOptions: AuthOptions = {
  secret: process.env.AUTH_SECRET ?? '',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    signIn: async ({ account }) => {
      if (account && Object.values<string>(AuthProviders).includes(account.provider)) {
        try {
          const response = await axios.post(`/auth/login/${account.provider}`, null, {
            headers: {
              Authorization: account?.access_token,
            },
          });

          (response.headers['set-cookie'] ?? []).forEach(cookieString => {
            const { name, value, ...options } = parseCookieString(cookieString);
            cookies().set(name, value, options);
          });
        } catch (error: any) {
          if (
            error?.response?.status === HttpStatusCode.Unauthorized &&
            error?.response?.data?.message
          ) {
            cookies().set('next-auth.error', error.response.data.message);
          } else {
            cookies().set('next-auth.error', 'Internal server error');
          }
        }
      }

      return true;
    },
  },
  pages: {
    signIn: ApplicationRoutes.SignIn,
    error: ApplicationRoutes.SignIn,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
