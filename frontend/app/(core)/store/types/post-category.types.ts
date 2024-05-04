import { Post } from './post.types';

export interface PostCategory {
  name: string;
  posts?: Post[];
}
