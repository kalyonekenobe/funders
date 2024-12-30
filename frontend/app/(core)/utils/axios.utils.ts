import axios, { HttpStatusCode } from 'axios';
import { cookies } from 'next/headers';
import { setCookies, removeCookies } from '../actions/auth.actions';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  async config => {
    const serverCookies = await cookies();
    config.headers.Cookie = serverCookies.toString();
    config.headers['Cache-Control'] = 'no-cache';
    return config;
  },
  async error => Promise.reject(error),
);

instance.interceptors.response.use(
  async response => {
    setCookies(response.headers['set-cookie'] ?? []);
    return response;
  },
  async error => {
    const serverCookies = await cookies();
    const originalRequest = error.config;
    if (error.response.status === HttpStatusCode.Unauthorized && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              Cookie: serverCookies.toString(),
            },
          },
        );

        await setCookies(response.headers['set-cookie'] ?? []);

        error.config.headers = {
          ...error.config.headers,
          Cookie: serverCookies.toString(),
        };

        return instance(originalRequest);
      } catch (refreshError) {
        await removeCookies([
          process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'Funders-Access-Token',
          process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'Funders-Refresh-Token',
        ]);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
