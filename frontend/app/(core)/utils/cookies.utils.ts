export interface ICookie {
  name: string;
  value: string;
  path?: string;
  httpOnly?: boolean;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
  secure?: boolean;
  maxAge?: number;
  domain?: string;
  signed?: boolean;
}

export const parseCookieString = (cookie: string): ICookie => {
  const options = cookie.split(';');
  const result = options.reduce((previousValue, currentValue) => {
    const [key, value] = currentValue.trim().split('=');

    switch (key.toLowerCase()) {
      case 'path':
        previousValue.path = value;
        break;
      case 'httponly':
        previousValue.httpOnly =
          !value || value === 'true' ? true : value === 'false' ? false : undefined;
        break;
      case 'samesite':
        previousValue.sameSite =
          !value || value === 'true'
            ? true
            : value === 'false'
              ? false
              : value === 'lax' || value === 'strict' || value === 'none'
                ? value
                : undefined;
        break;
      case 'secure':
        previousValue.secure =
          !value || value === 'true' ? true : value === 'false' ? false : undefined;
        break;
      case 'maxage':
        previousValue.maxAge = value ? Number(value) : undefined;
        break;
      case 'domain':
        previousValue.domain = value;
        break;
      case 'signed':
        previousValue.signed =
          !value || value === 'true' ? true : value === 'false' ? false : undefined;
        break;
      default:
        previousValue.name = key;
        previousValue.value = value;
    }
    return previousValue;
  }, {} as ICookie);

  if (!result.name && !result.value) {
    throw new Error('Cannot parse the cookie string');
  }

  return result;
};
