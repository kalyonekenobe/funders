import { PostComment } from './post-comment.types';
import { Post } from './post.types';

export enum UserReactionTypeEnum {
  Like = 'Like',
  Dislike = 'Dislike',
  Laugh = 'Laugh',
  Crying = 'Crying',
  Heart = 'Heart',
  Anger = 'Anger',
}

export interface UserReactionType {
  name: string;
  posts?: Post[];
  comments?: PostComment[];
}
