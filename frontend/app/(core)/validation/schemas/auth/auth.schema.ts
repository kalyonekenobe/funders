import {
  date,
  email,
  maxLength,
  maxValue,
  minLength,
  minValue,
  pipe,
  regex,
  strictObject,
  string,
  trim,
} from 'valibot';

export const LoginSchema = strictObject({
  email: pipe(
    string(),
    email('Please enter a valid email address in the format example@example.com.'),
    trim(),
  ),
  password: pipe(
    string(
      'The user password must contain at least 8 characters, latin letters, numbers and special symbols.',
    ),

    trim(),
    regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&\.])[A-Za-z\d@$!%*#?&\.]{8,}$/,
      'The user password must contain at least 8 characters, latin letters, numbers and special symbols.',
    ),
  ),
});

export const RegisterSchema = strictObject({
  email: pipe(
    string(),
    trim(),
    email('Please enter a valid email address in the format example@example.com.'),
  ),
  password: pipe(
    string(
      'The user password must contain at least 8 characters, latin letters, numbers and special symbols.',
    ),
    trim(),
    regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&\.])[A-Za-z\d@$!%*#?&\.]{8,}$/,
      'The user password must contain at least 8 characters, latin letters, numbers and special symbols.',
    ),
  ),
  firstName: pipe(
    string('Please enter a first name containing between 2 and 50 characters.'),
    trim(),
    minLength(2, 'Please enter a first name containing between 2 and 50 characters.'),
    maxLength(50, 'Please enter a first name containing between 2 and 50 characters.'),
  ),
  lastName: pipe(
    string('Please enter a last name containing between 2 and 50 characters.'),
    trim(),
    minLength(2, 'Please enter a last name containing between 2 and 50 characters.'),
    maxLength(50, 'Please enter a last name containing between 2 and 50 characters.'),
  ),
  birthDate: pipe(
    date('The user must be at least 14 years old.'),
    minValue(
      new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
      'The user must be at least 14 years old.',
    ), // Max user age can be 100 years
    maxValue(
      new Date(new Date().setFullYear(new Date().getFullYear() - 14)),
      'The user must be at least 14 years old.',
    ), // Min user age can be 14 years
  ),
  wallet: pipe(
    string('Please choose a valid solana wallet address'),
    trim(),
    minLength(1, 'Please choose a valid solana wallet address'),
  ),
});
