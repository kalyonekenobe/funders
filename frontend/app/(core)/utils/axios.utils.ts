import axios, { HttpStatusCode } from 'axios';
import { signOut } from 'next-auth/react';
import getConfig from 'next/config';
import { cookies } from 'next/headers';
import { ApplicationRoutes } from './routes.utils';
import { parseCookieString } from './cookies.utils';

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
const backendUrl = serverRuntimeConfig.backendUrl || publicRuntimeConfig.backendUrl;

const instance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

instance.interceptors.request.use(
  async config => {
    const accessToken = cookies().get(
      process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'Funders-Access-Token',
    );

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  async error => Promise.reject(error),
);

instance.interceptors.response.use(
  async response => {
    (response.headers['set-cookie'] ?? []).forEach(cookieString => {
      const { name, value, ...options } = parseCookieString(cookieString);
      cookies().set(name, value, options);
    });
    return response;
  },
  async error => {
    const refreshToken = cookies().get(
      process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'Funders-Refresh-Token',
    );

    if (error.response.status === HttpStatusCode.Unauthorized && refreshToken) {
      try {
        // Using fetch call instead of axios to avoid recursive calls in case of refresh error
        const response = await fetch('/auth/refresh', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status !== HttpStatusCode.Created) {
          throw new Error('Cannot receive the new pair of access and refresh tokens');
        }

        const { accessToken, refreshToken } = await response.json();

        error.config.sent = true;
        error.config.headers = {
          ...error.config.headers,
          Authorization: `Bearer ${accessToken}`,
        };

        cookies().set(process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'Funders-Access-Token', accessToken);
        cookies().set(
          process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'Funders-Refresh-Token',
          refreshToken,
        );

        return instance(error.config);
      } catch (error) {
        cookies().delete(process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'Funders-Access-Token');
        cookies().delete(process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'Funders-Refresh-Token');
        signOut({ callbackUrl: ApplicationRoutes.SignIn });
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
