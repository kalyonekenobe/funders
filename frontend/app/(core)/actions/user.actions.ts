'use server';

import axios from '@/app/(core)/utils/axios.utils';
import { User } from '../store/types/user.types';
import qs from 'qs';
import { HttpStatusCode } from 'axios';
import { Following } from '../store/types/following.types';
import { getAuthInfo, setCookies } from './auth.actions';
import { ValiError, flatten, parse } from 'valibot';
import { UserUpdateSchema } from '../validation/schemas/auth/user.schema';
import { cookies } from 'next/headers';

export const getUserFriendsAndSuggestions = async (userId: string, limit: number = 10) => {
  let result = {
    friends: [],
    suggestions: [],
  };

  try {
    const followingsResponse = await axios.get(`/users/${userId}/followings`);

    if (followingsResponse.status === HttpStatusCode.Ok) {
      const query = qs.stringify(
        {
          where: {
            followerId: {
              in: followingsResponse.data.map((following: User) => following.id),
            },
          },
          select: { userId: true },
          take: limit,
        },
        { arrayFormat: 'comma', allowDots: true, commaRoundTrip: true } as any,
      );
      const friendsResponse = await axios.get(
        `/users/${userId}/followers${query ? `?${query}` : ''}`,
      );

      if (friendsResponse.status === HttpStatusCode.Ok) {
        result.friends = friendsResponse.data;
        const suggestionsQuery = qs.stringify(
          {
            where: {
              id: {
                notIn: [...followingsResponse.data.map((following: User) => following.id), userId],
              },
            },
            take: limit,
          },
          { arrayFormat: 'comma', allowDots: true, commaRoundTrip: true } as any,
        );

        const suggestionsRepsponse = await axios.get(
          `/users${suggestionsQuery ? `?${suggestionsQuery}` : ''}`,
        );

        if (suggestionsRepsponse.status === HttpStatusCode.Ok) {
          result.suggestions = suggestionsRepsponse.data;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

  return result;
};

export const getAllUsers = async (options?: unknown): Promise<User[]> => {
  try {
    const query = qs.stringify(options, {
      arrayFormat: 'comma',
      allowDots: true,
      commaRoundTrip: true,
    } as any);
    const response = await axios.get(`/users${query ? `?${query}` : ''}`);

    if (response.status === HttpStatusCode.Ok) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }

  return [];
};

export const getUser = async (id: string, options?: unknown): Promise<User | null> => {
  try {
    const query = qs.stringify(options);
    const response = await axios.get(`/users/${id}/${query ? `?${query}` : ''}`);

    if (response.status === HttpStatusCode.Ok) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const followUser = async (
  id: string,
): Promise<{ error?: string; data: Following | null }> => {
  try {
    const authenticatedUser = await getAuthInfo();

    if (authenticatedUser) {
      const response = await axios.post(`/users/${id}/followers/${authenticatedUser.userId}`, {});

      if (response.status === HttpStatusCode.Created) {
        return { data: response.data };
      }
    }
  } catch (error: any) {
    console.log(error);
    return { error: error.response.data.message, data: null };
  }

  return { error: 'Cannot follow this user', data: null };
};

export const unfollowUser = async (
  id: string,
): Promise<{ error?: string; data: Following | null }> => {
  try {
    const authenticatedUser = await getAuthInfo();

    if (authenticatedUser) {
      const response = await axios.delete(`/users/${id}/followers/${authenticatedUser.userId}`);

      if (response.status === HttpStatusCode.Ok) {
        return { data: response.data };
      }
    }
  } catch (error: any) {
    console.log(error);
    return { error: error.response.data.message, data: null };
  }

  return { error: 'Cannot unfollow this user', data: null };
};

export const udpateUser = async (state: any, formData: FormData) => {
  let { id, confirmPassword, avatar, ...data } = Object.fromEntries(formData) as any;
  try {
    if (data.birthDate) data.birthDate = new Date(data.birthDate);
    if (data.phone === '') data.phone = null;
    if (data.bio === '') data.bio = null;

    const user = (await parse(UserUpdateSchema, data)) as any;

    if (confirmPassword !== data.password) {
      throw new ValiError([
        { reason: 'any', context: '', input: '', expected: '', received: '', message: '' },
      ]);
    }

    if (user.phone === null) user.phone = '';
    if (user.bio === null) user.bio = '';

    if (avatar !== undefined) {
      user.avatar = avatar === '' ? null : avatar;
    }

    const userFormData = new FormData();
    Object.entries(user).forEach(([key, value]: [string, unknown]) => {
      userFormData.set(key, !value ? '' : (value as string | Blob));
    });

    const response = await axios.put(`/users/${id}`, userFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const refreshResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
      {},
      {
        withCredentials: true,
        headers: {
          Cookie: cookies().toString(),
        },
      },
    );

    setCookies(refreshResponse.headers['set-cookie'] ?? []);

    if (response.status === HttpStatusCode.Ok) {
      return { ...state, errors: {} };
    }
  } catch (error: any) {
    if (error instanceof ValiError) {
      if (confirmPassword !== data.password) {
        error.issues = [
          ...error.issues,
          {
            reason: 'any',
            context: 'confirm_password',
            input: confirmPassword,
            expected: data.password,
            received: confirmPassword,
            message: 'Passwords are different.',
            path: [
              {
                type: 'object',
                origin: 'value',
                input: confirmPassword,
                key: 'confirmPassword',
                value: confirmPassword,
              },
            ],
          },
        ].filter(issue => issue.context !== '') as any;
      }

      return {
        ...state,
        errors: flatten(error),
      };
    }

    if (error.response?.status === HttpStatusCode.Unauthorized) {
      return {
        errors: {
          ...state,
          global: 'The provided data is invalid. Please, try again.',
        },
      };
    }
  }

  return {
    errors: {
      ...state,
      global: 'Internal server error.',
    },
  };
};
