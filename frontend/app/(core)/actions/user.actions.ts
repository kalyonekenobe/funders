'use server';

import axios from '@/app/(core)/utils/axios.utils';
import { User } from '../store/types/user.types';
import qs from 'qs';
import { HttpStatusCode } from 'axios';

export const getUserFriendsAndSuggestions = async (user: User, limit: number = 10) => {
  let result = {
    friends: [],
    suggestions: [],
  };

  try {
    const followingsResponse = await axios.get(`/users/${user.id}/followings`);

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
        `/users/${user.id}/followers${query ? `?${query}` : ''}`,
      );

      if (friendsResponse.status === HttpStatusCode.Ok) {
        result.friends = friendsResponse.data;
        const suggestionsQuery = qs.stringify(
          {
            where: {
              id: {
                notIn: [...followingsResponse.data.map((following: User) => following.id), user.id],
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
    // console.log(error);
  }

  return result;
};
