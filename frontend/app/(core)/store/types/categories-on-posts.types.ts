import { PostCategory } from './post-category.types';
import { Post } from './post.types';

export interface CategoriesOnPosts {
  postId: string;
  category: string;
  post?: Post;
  postCategory?: PostCategory[];
}
