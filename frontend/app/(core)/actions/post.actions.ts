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
import { ValiError, flatten, parse } from 'valibot';
import {
  CreatePostCommentSchema,
  UpdatePostCommentSchema,
} from '../validation/schemas/post/post-comment.schema';
import { PostCategory } from '../store/types/post-category.types';
import { CreatePostSchema, UpdatePostSchema } from '../validation/schemas/post/post.schema';
import { revalidatePath } from 'next/cache';
import { ApplicationRoutes } from '../utils/routes.utils';

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

export const addPostComment = async (state: any, postId: string, formData: FormData) => {
  const { attachments, ...data } = Object.fromEntries(formData) as any;

  try {
    const authenticatedUser = await getAuthInfo();

    if (authenticatedUser) {
      const comment = await parse(CreatePostCommentSchema, data);

      const attachmentsErrors = {} as any;
      formData.getAll('attachments').forEach((_, i) => {
        const filename = (formData.get(`attachments[${i}][filename]`) || '') as string;
        if (!filename?.trim()) {
          attachmentsErrors[i] = ['Filename cannot be empty'];
        }
      });

      if (Object.entries(attachmentsErrors).length > 0) {
        return {
          ...state,
          errors: {
            nested: {
              attachments: attachmentsErrors,
            },
          },
        };
      }

      formData.delete('comment');
      formData.set('content', comment.comment);
      formData.set('authorId', authenticatedUser.userId);

      const query = qs.stringify(
        {
          include: {
            author: true,
            attachments: true,
            parentComment: { include: { author: true } },
          },
        },
        { allowDots: true },
      );
      const response = await axios.post(
        `/posts/${postId}/comments${query ? `?${query}` : ''}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status === HttpStatusCode.Created) {
        return { ...state, errors: {}, createdComment: response.data };
      }
    }
  } catch (error: any) {
    console.log(error);
    if (error instanceof ValiError) {
      return {
        ...state,
        errors: flatten(error),
      };
    }

    if (error.response?.status === HttpStatusCode.Unauthorized) {
      return {
        ...state,
        errors: {
          global: error.response?.data?.message ?? 'Internal server error.',
        },
      };
    }
  }

  return {
    ...state,
    errors: {
      global: 'Internal server error.',
    },
  };
};

export const editPostComment = async (state: any, commentId: string, formData: FormData) => {
  const { attachments, ...data } = Object.fromEntries(formData) as any;

  try {
    const authenticatedUser = await getAuthInfo();

    if (authenticatedUser) {
      const comment = await parse(UpdatePostCommentSchema, data);

      const attachmentsErrors = {} as any;
      formData.getAll('attachments').forEach((_, i) => {
        const filename = (formData.get(`attachments[${i}][filename]`) || '') as string;
        if (!filename?.trim()) {
          attachmentsErrors[i] = ['Filename cannot be empty'];
        }
      });

      if (Object.entries(attachmentsErrors).length > 0) {
        return {
          ...state,
          errors: {
            nested: {
              attachments: attachmentsErrors,
            },
          },
        };
      }

      formData.delete('comment');
      formData.set('content', comment.comment);

      const query = qs.stringify(
        {
          include: {
            author: true,
            attachments: true,
            parentComment: { include: { author: true } },
          },
        },
        { allowDots: true },
      );
      const response = await axios.put(
        `/comments/${commentId}${query ? `?${query}` : ''}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status === HttpStatusCode.Ok) {
        return { ...state, errors: {}, editedComment: response.data };
      }
    }
  } catch (error: any) {
    console.log(error);
    if (error instanceof ValiError) {
      return {
        ...state,
        errors: flatten(error),
      };
    }

    if (error.response?.status === HttpStatusCode.Unauthorized) {
      return {
        ...state,
        errors: {
          global: error.response?.data?.message ?? 'Internal server error.',
        },
      };
    }
  }

  return {
    ...state,
    errors: {
      global: 'Internal server error.',
    },
  };
};

export const getAllPostCategories = async (): Promise<PostCategory[]> => {
  try {
    const response = await axios.get('/post-categories');

    if (response.status === HttpStatusCode.Ok) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }

  return [];
};

export const createPost = async (state: any, formData: FormData) => {
  const { attachments, categories, ...data } = Object.fromEntries(formData) as any;

  try {
    const authenticatedUser = await getAuthInfo();

    if (authenticatedUser) {
      data.fundsToBeRaised = Number(data.fundsToBeRaised);
      data.isDraft = data.isDraft === 'true';
      const post = await parse(CreatePostSchema, data);

      const attachmentsErrors = {} as any;
      formData.getAll('attachments').forEach((_, i) => {
        const filename = (formData.get(`attachments[${i}][filename]`) || '') as string;
        if (!filename?.trim()) {
          attachmentsErrors[i] = ['Filename cannot be empty'];
        }
      });

      if (Object.entries(attachmentsErrors).length > 0) {
        return {
          ...state,
          errors: {
            nested: {
              attachments: attachmentsErrors,
            },
          },
        };
      }

      formData.set('authorId', authenticatedUser.userId);

      if (formData.get('isDraft') === 'false') {
        formData.delete('isDraft');
      }

      const response = await axios.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === HttpStatusCode.Created) {
        revalidatePath(ApplicationRoutes.Home);
        return { ...state, errors: {} };
      }
    }
  } catch (error: any) {
    console.log(error);
    if (error instanceof ValiError) {
      return {
        ...state,
        errors: flatten(error),
      };
    }

    if (error.response?.status === HttpStatusCode.Unauthorized) {
      return {
        ...state,
        errors: {
          global: error.response?.data?.message ?? 'Internal server error.',
        },
      };
    }
  }

  return {
    ...state,
    errors: {
      global: 'Internal server error.',
    },
  };
};

export const updatePost = async (state: any, postId: string, formData: FormData) => {
  const { attachments, categories, ...data } = Object.fromEntries(formData) as any;

  try {
    data.fundsToBeRaised = Number(data.fundsToBeRaised);
    data.isDraft = data.isDraft === 'true';
    const post = await parse(UpdatePostSchema, data);

    const attachmentsErrors = {} as any;
    formData.getAll('attachments').forEach((_, i) => {
      const filename = (formData.get(`attachments[${i}][filename]`) || '') as string;
      if (!filename?.trim()) {
        attachmentsErrors[i] = ['Filename cannot be empty'];
      }
    });

    if (Object.entries(attachmentsErrors).length > 0) {
      return {
        ...state,
        errors: {
          nested: {
            attachments: attachmentsErrors,
          },
        },
      };
    }

    if (formData.get('isDraft') === 'false') {
      formData.delete('isDraft');
    }

    const response = await axios.put(`/posts/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === HttpStatusCode.Ok) {
      revalidatePath(ApplicationRoutes.Home);
      return { ...state, errors: {} };
    }
  } catch (error: any) {
    console.log(error);
    if (error instanceof ValiError) {
      return {
        ...state,
        errors: flatten(error),
      };
    }

    if (error.response?.status === HttpStatusCode.Unauthorized) {
      return {
        ...state,
        errors: {
          global: error.response?.data?.message ?? 'Internal server error.',
        },
      };
    }
  }

  return {
    ...state,
    errors: {
      global: 'Internal server error.',
    },
  };
};
