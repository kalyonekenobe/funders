import {
  date,
  email,
  maxLength,
  maxValue,
  minLength,
  minValue,
  never,
  object,
  regex,
  string,
  toCustom,
  toTrimmed,
  union,
} from 'valibot';

export const LoginSchema = object(
  {
    email: string([
      toTrimmed(),
      email('Please enter a valid email address in the format example@example.com.'),
    ]),
    password: string(
      'The user password must contain at least 8 characters, latin letters, numbers and special symbols.',
      [
        toTrimmed(),
        regex(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          'The user password must contain at least 8 characters, latin letters, numbers and special symbols.',
        ),
      ],
    ),
  },
  never(),
);

export const RegisterSchema = object(
  {
    email: string([
      toTrimmed(),
      email('Please enter a valid email address in the format example@example.com.'),
    ]),
    password: string(
      'The user password must contain at least 8 characters, latin letters, numbers and special symbols.',
      [
        toTrimmed(),
        regex(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          'The user password must contain at least 8 characters, latin letters, numbers and special symbols.',
        ),
      ],
    ),
    firstName: string('Please enter a first name containing between 2 and 50 characters.', [
      toTrimmed(),
      minLength(2, 'Please enter a first name containing between 2 and 50 characters.'),
      maxLength(50, 'Please enter a first name containing between 2 and 50 characters.'),
    ]),
    lastName: string('Please enter a last name containing between 2 and 50 characters.', [
      toTrimmed(),
      minLength(2, 'Please enter a last name containing between 2 and 50 characters.'),
      maxLength(50, 'Please enter a last name containing between 2 and 50 characters.'),
    ]),
    birthDate: union([
      date('The user must be at least 14 years old.', [
        minValue(new Date(new Date().setFullYear(new Date().getFullYear() - 100))), // Max user age can be 100 years
        maxValue(new Date(new Date().setFullYear(new Date().getFullYear() - 14))), // Min user age can be 14 years
      ]),
    ]),
  },
  never(),
);
