import {
  date,
  email,
  maxLength,
  maxValue,
  minLength,
  minValue,
  object,
  regex,
  string,
  toCustom,
  toTrimmed,
  transform,
  union,
} from 'valibot';

export const LoginSchema = object({
  email: string([toTrimmed(), email()]),
  password: string(
    'The user password must contain at least 8 characters, latin letters, numbers and special symbols',
    [toTrimmed(), regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)],
  ),
});

export const RegisterSchema = object({
  email: string([toTrimmed(), email()]),
  password: string(
    'The user password must contain at least 8 characters, latin letters, numbers and special symbols',
    [toTrimmed(), regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)],
  ),
  firstName: string([toTrimmed(), minLength(2), maxLength(50)]),
  lastName: string([toTrimmed(), minLength(2), maxLength(50)]),
  birthDate: union([
    date([
      minValue(new Date(new Date().setFullYear(new Date().getFullYear() - 100))), // Max user age can be 100 years
      maxValue(new Date(new Date().setFullYear(new Date().getFullYear() - 14))), // Min user age can be 14 years
    ]),
  ]),
});
