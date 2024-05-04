import { Post } from "./post.types";

export interface PostAttachment {
  id: string;
  postId: string;
  file: string;
  filename: string | null;
  resourceType: string;
  post?: Post;
}
