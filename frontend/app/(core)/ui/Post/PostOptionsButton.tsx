'use client';

import { ButtonHTMLAttributes, FC } from 'react';
import { Post } from '../../store/types/post.types';

export interface PostOptionsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  post: Post;
}

const PostOptionsButton: FC<PostOptionsButtonProps> = ({ post, children, ...props }) => {
  return <button {...props}>{children}</button>;
};

export default PostOptionsButton;
