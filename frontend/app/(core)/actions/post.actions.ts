'use server';

import axios from '@/app/(core)/utils/axios.utils';
import { HttpStatusCode } from 'axios';
import { Post } from '../store/types/post.types';
import qs from 'qs';
import { UserReactionTypeEnum } from '../store/types/user-reaction-type.types';
import { PostReaction } from '../store/types/post-reaction.types';
import { getAuthInfo } from './auth.actions';
import { PostDonation } from '../store/types/post-donation.types';
import { PostCommentReaction } from '../store/types/post-comment-reaction.types';
import { PostComment } from '../store/types/post-comment.types';

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

export const addPostCommentReaction = async (
  postCommentId: string,
  reaction: UserReactionTypeEnum,
): Promise<{ error?: string; data: PostCommentReaction | null }> => {
  try {
    const authenticatedUser = await getAuthInfo();

    if (authenticatedUser) {
      const response = await axios.post(`/comments/${postCommentId}/reactions`, {
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

  return { error: 'Cannot add reaction to the post comment', data: null };
};

export const removePostCommentReaction = async (
  postCommentId: string,
): Promise<{ error?: string; data: PostCommentReaction | null }> => {
  try {
    const authenticatedUser = await getAuthInfo();

    if (authenticatedUser) {
      const response = await axios.delete(
        `/comments/${postCommentId}/reactions/${authenticatedUser.userId}`,
      );

      if (response.status === HttpStatusCode.Ok) {
        return { data: response.data };
      }
    }
  } catch (error: any) {
    console.log(error);
    return { error: error.response.data.message, data: null };
  }

  return { error: 'Cannot remove reaction from the post comment', data: null };
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

export const removePostComment = async (
  postCommentId: string,
): Promise<{ error?: string; data: PostComment | null }> => {
  try {
    const response = await axios.delete(`/comments/${postCommentId}`);

    if (response.status === HttpStatusCode.Ok) {
      return { data: response.data };
    }
  } catch (error: any) {
    console.log(error);
    return { error: error.response.data.message, data: null };
  }

  return { error: 'Cannot remove post comments. Please, try again later', data: null };
};

export const getPost = async (id: string, options?: unknown): Promise<Post | null> => {
  try {
    const query = qs.stringify(options, {
      allowDots: true,
      arrayFormat: 'comma',
      commaRoundTrip: true,
    } as any);
    const response = await axios.get(`/posts/${id}/${query ? `?${query}` : ''}`);

    if (response.status === HttpStatusCode.Ok) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const donate = async (
  id: string,
  donation: number,
  paymentInfo: string,
): Promise<{ error?: string; data: PostDonation | null }> => {
  try {
    const response = await axios.post(`/posts/${id}/donations`, { donation, paymentInfo });

    if (response.status === HttpStatusCode.Created) {
      return { data: response.data };
    }
  } catch (error: any) {
    console.log(error);
    return { error: error.response.data.message, data: null };
  }

  return { error: 'Cannot make a donation to the post', data: null };
};

export const createPaymentCharge = async (
  amount: number,
): Promise<{ error?: string; data: { clientSecret: string; id: string } | null }> => {
  try {
    const authenticatedUser = await getAuthInfo();

    if (authenticatedUser) {
      const response = await axios.post('/payments/charge', { amount });

      if (response.status === HttpStatusCode.Created) {
        return { data: response.data };
      }
    }
  } catch (error: any) {
    console.log(error);
    return { error: error.response.data.message, data: null };
  }

  return { error: 'Cannot proceed the action. Please, try again later', data: null };
};
