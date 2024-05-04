import { PostComment } from './post-comment.types';
import { UserReactionType, UserReactionTypeEnum } from './user-reaction-type.types';
import { User } from './user.types';

export interface PostCommentReaction {
  commentId: string;
  userId: string;
  reactionType: UserReactionTypeEnum;
  datetime: Date;
  user?: User;
  comment?: PostComment;
  userReactionType?: UserReactionType;
}
