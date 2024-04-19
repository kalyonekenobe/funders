'use server';

import { ValiError, flatten, parse } from 'valibot';
import { LoginSchema } from '../validation/schemas/auth/auth.schema';
import axios from '@/app/(core)/utils/axios.utils';
import { HttpStatusCode } from 'axios';

export const signIn = async (state: any, formData: FormData) => {
  try {
    const { email, password } = Object.fromEntries(formData);
    const credentials = await parse(LoginSchema, { email, password });

    const response = await axios.post('/auth/login', credentials);

    if (response.status === HttpStatusCode.Created) {
      return { ...state, errors: {} };
    }
  } catch (error: any) {
    if (error instanceof ValiError) {
      return {
        ...state,
        errors: flatten(error),
      };
    }

    return {
      errors: {
        ...state,
        global: error?.response?.data?.message ?? 'Internal server error.',
      },
    };
  }

  return {
    errors: {
      ...state,
      global: 'Internal server error.',
    },
  };
};
