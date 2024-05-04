import { User } from './user.types';

export interface Following {
  followerId: string;
  userId: string;
  follower?: User;
  user?: User;
}
