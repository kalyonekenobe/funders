import { PostDonation } from './post-donation';
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
  categories?: any[];
  attachments?: any[];
  donations?: PostDonation[];
  reactions?: any[];
  comments?: any[];
}
