import { PostCommentAttachment } from './post-comment-attachment.types';
import { PostCommentReaction } from './post-comment-reaction.types';
import { Post } from './post.types';
import { User } from './user.types';

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  parentCommentId: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  removedAt: Date | null;
  post?: Post;
  author?: User;
  parentComment?: PostComment;
  replies?: PostComment[];
  reactions?: PostCommentReaction[];
  attachments?: PostCommentAttachment[];
}
