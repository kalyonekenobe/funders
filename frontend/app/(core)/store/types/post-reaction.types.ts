import { Post } from './post.types';
import { UserReactionType, UserReactionTypeEnum } from './user-reaction-type.types';
import { User } from './user.types';

export interface PostReaction {
  userId: string;
  postId: string;
  reactionType: UserReactionTypeEnum;
  datetime: Date;
  user?: User;
  post?: Post;
  userReactionType?: UserReactionType;
}
