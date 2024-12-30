import {
  date,
  maxLength,
  maxValue,
  minLength,
  minValue,
  optional,
  regex,
  string,
  trim,
  nullable,
  pipe,
  strictObject,
} from 'valibot';

export const UserUpdateSchema = strictObject({
  role: optional(
    pipe(
      string('The user role can be only Default, Volunteer or Administrator'),
      trim(),
      regex(
        /(Default|Volunteer|Administrator)/i,
        'The user role can be only Default, Volunteer or Administrator',
      ),
    ),
  ),
  phone: nullable(
    optional(
      pipe(
        string(
          "The user phone must contain only numbers and  optionally '+' sign in the begining.",
        ),
        trim(),
        regex(
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i,
          "The user phone must contain only numbers and  optionally '+' sign in the begining.",
        ),
      ),
    ),
  ),
  bio: nullable(optional(string())),
  password: optional(
    pipe(
      string(
        'The user password must contain at least 8 characters, latin letters, numbers and special symbols.',
      ),
      trim(),
      regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&\.])[A-Za-z\d@$!%*#?&\.]{8,}$/,
        'The user password must contain at least 8 characters, latin letters, numbers and special symbols.',
      ),
    ),
  ),
  firstName: optional(
    pipe(
      string('Please enter a first name containing between 2 and 50 characters.'),
      trim(),
      minLength(2, 'Please enter a first name containing between 2 and 50 characters.'),
      maxLength(50, 'Please enter a first name containing between 2 and 50 characters.'),
    ),
  ),
  lastName: optional(
    pipe(
      string('Please enter a last name containing between 2 and 50 characters.'),
      trim(),
      minLength(2, 'Please enter a last name containing between 2 and 50 characters.'),
      maxLength(50, 'Please enter a last name containing between 2 and 50 characters.'),
    ),
  ),
  birthDate: optional(
    pipe(
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
  ),
});
