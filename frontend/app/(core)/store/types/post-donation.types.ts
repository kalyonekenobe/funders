import { Post } from './post.types';

export interface PostDonation {
  id: string;
  postId: string;
  cardNumber: string;
  donation: number;
  datetime: Date;
  post?: Post;
}
