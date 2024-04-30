import { CategoriesOnPosts } from './categories-on-posts.types';
import { PostAttachment } from './post-attachment.types';
import { PostComment } from './post-comment.types';
import { PostDonation } from './post-donation.types';
import { PostReaction } from './post-reaction.types';
import { User } from './user.types';

export interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  fundsToBeRaised: number;
  image: string | null;
  isDraft: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  removedAt: Date | null;
  author?: User;
  categories?: CategoriesOnPosts[];
  attachments?: PostAttachment[];
  donations?: PostDonation[];
  reactions?: PostReaction[];
  comments?: PostComment[];
}
