import { RequestCookies, ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest, NextResponse } from 'next/server';

export const capitalize = (string: string): string => {
  return string.length ? `${string[0].toUpperCase()}${string.slice(1)}` : string;
};

export const applySetRequestCookies = (request: NextRequest, res: NextResponse): void => {
  const cookiesToBeSet = new ResponseCookies(res.headers);
  const newRequestHeaders = new Headers(request.headers);
  const newRequestCookies = new RequestCookies(newRequestHeaders);
  cookiesToBeSet.getAll().forEach(cookie => newRequestCookies.set(cookie));
  NextResponse.next({ request: { headers: newRequestHeaders } }).headers.forEach((value, key) => {
    if (key === 'x-middleware-override-headers' || key.startsWith('x-middleware-request-')) {
      res.headers.set(key, value);
    }
  });
};
