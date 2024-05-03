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

export const resolveImage = (
  source?: string | null,
  placeholder:
    | 'default-image-placeholder'
    | 'default-profile-image'
    | 'post-image-placeholder'
    | 'profile-background-placeholder'
    | 'profile-image-placeholder' = 'default-image-placeholder',
) => {
  if (source) {
    return `${process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE_PREFIX}${source}.${getFileExtension(
      source,
    )}`;
  }

  switch (placeholder) {
    case 'default-image-placeholder':
      return (
        process.env.NEXT_PUBLIC_DEFAULT_IMAGE_PLACEHOLDER_SRC || '/default-image-placeholder.webp'
      );
    case 'default-profile-image':
      return process.env.NEXT_PUBLIC_DEFAULT_PROFILE_IMAGE_SRC || '/default-profile-image.webp';
    case 'post-image-placeholder':
      return process.env.NEXT_PUBLIC_POST_IMAGE_PLACEHOLDER_SRC || '/post-image-placeholder.webp';
    case 'profile-background-placeholder':
      return (
        process.env.NEXT_PUBLIC_PROFILE_BACKGROUND_PLACEHOLDER_SRC ||
        '/profile-background-placeholder.webp'
      );
    case 'profile-image-placeholder':
      return (
        process.env.NEXT_PUBLIC_PROFILE_IMAGE_PLACEHOLDER_SRC || '/profile-image-placeholder.webp'
      );
  }
};

export const getFileExtension = (source: string): unknown =>
  /[.]/.exec(source) ? /[^.]+$/.exec(source) : '';

export const resolveFilePath = (source: string, resourseType: 'image' | 'video' | 'raw') => {
  return `${process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE_PREFIX}/${resourseType}/upload/${source}${
    resourseType !== 'raw' ? `.${getFileExtension(source)}` : ''
  }`;
};

export const fileWithExtension = (filename: string): string => {
  return `${filename}.${getFileExtension(filename) || ''}`;
};
