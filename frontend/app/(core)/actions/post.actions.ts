'use server';

import axios from '@/app/(core)/utils/axios.utils';
import { HttpStatusCode } from 'axios';
import { Post } from '../store/types/post.types';
import qs from 'qs';
import { UserReactionTypeEnum } from '../store/types/user-reaction-type.types';
import { PostReaction } from '../store/types/post-reaction.types';
import { getAuthInfo } from './auth.actions';

export const getAllPosts = async (options?: unknown): Promise<Post[]> => {
  try {
    const query = qs.stringify(options, { allowDots: true });
    const response = await axios.get(`/posts${query ? `?${query}` : ''}`);

    if (response.status === HttpStatusCode.Ok) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }

  return [];
};

export const addPostReaction = async (
  postId: string,
  reaction: UserReactionTypeEnum,
): Promise<{ error?: string; data: PostReaction | null }> => {
  try {
    const authenticatedUser = await getAuthInfo();

    if (authenticatedUser) {
      const response = await axios.post(`/posts/${postId}/reactions`, {
        userId: authenticatedUser.userId,
        reactionType: reaction,
      });

      if (response.status === HttpStatusCode.Created) {
        return { data: response.data };
      }
    }
  } catch (error: any) {
    console.log(error);
    return { error: error.response.data.message, data: null };
  }

  return { error: 'Cannot add reaction to the post', data: null };
};

export const removePostReaction = async (
  postId: string,
): Promise<{ error?: string; data: PostReaction | null }> => {
  try {
    const authenticatedUser = await getAuthInfo();

    if (authenticatedUser) {
      const response = await axios.delete(`/posts/${postId}/reactions/${authenticatedUser.userId}`);

      if (response.status === HttpStatusCode.Ok) {
        return { data: response.data };
      }
    }
  } catch (error: any) {
    console.log(error);
    return { error: error.response.data.message, data: null };
  }

  return { error: 'Cannot remove reaction from the post', data: null };
};

export const removePost = async (
  postId: string,
): Promise<{ error?: string; data: Post | null }> => {
  try {
    const response = await axios.delete(`/posts/${postId}`);

    if (response.status === HttpStatusCode.Ok) {
      return { data: response.data };
    }
  } catch (error: any) {
    console.log(error);
    return { error: error.response.data.message, data: null };
  }

  return { error: 'Cannot remove post. Please, try again later', data: null };
};
