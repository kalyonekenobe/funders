import axios, { HttpStatusCode } from 'axios';
import { cookies } from 'next/headers';
import { parseCookieString } from './cookies.utils';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  async config => {
    config.headers.Cookie = cookies();
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
    const originalRequest = error.config;
    if (error.response.status === HttpStatusCode.Unauthorized && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            Cookie: cookies(),
          },
          body: JSON.stringify({}),
        });

        const { accessToken, refreshToken } = response.data;

        cookies().set(process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'Funders-Access-Token', accessToken);
        cookies().set(
          process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'Funders-Refresh-Token',
          refreshToken,
        );

        error.config.headers = {
          ...error.config.headers,
          Cookie: cookies(),
        };

        return instance(originalRequest);
      } catch (refreshError) {
        cookies().delete(process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'Funders-Access-Token');
        cookies().delete(process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'Funders-Refresh-Token');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
