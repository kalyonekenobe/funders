import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import axios from '@/app/(core)/utils/axios.utils';
import { cookies } from 'next/headers';
import { parseCookieString } from '@/app/(core)/utils/cookies.utils';

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
      try {
        const response = await axios.post(`/auth/login/${account?.provider}`, null, {
          headers: {
            Authorization: account?.access_token,
          },
        });

        (response.headers['set-cookie'] ?? []).forEach(cookieString => {
          const { name, value, ...options } = parseCookieString(cookieString);
          cookies().set(name, value, options);
        });

        return true;
      } catch (error) {
        console.log(error);
      }
      return false;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
