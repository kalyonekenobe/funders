'use server';

import axios from '@/app/(core)/utils/axios.utils';
import { HttpStatusCode } from 'axios';
import { Post } from '../store/types/post.types';
import qs from 'qs';

export const getAllPosts = async (options?: unknown): Promise<Post[]> => {
  try {
    const query = qs.stringify(options);
    const response = await axios.get(`/posts${query ? `?${query}` : ''}`);

    if (response.status === HttpStatusCode.Ok) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }

  return [];
};
