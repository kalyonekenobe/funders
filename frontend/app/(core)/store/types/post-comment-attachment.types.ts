import { PostComment } from './post-comment.types';

export interface PostCommentAttachment {
  id: string;
  commentId: string;
  file: string;
  filename: string | null;
  resourceType: string;
  comment?: PostComment;
}
