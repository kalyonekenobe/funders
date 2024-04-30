'use client';

import { FC, HTMLAttributes, useState } from 'react';
import { Post } from '../../store/types/post.types';
import Link from 'next/link';
import { ApplicationRoutes } from '../../utils/routes.utils';
import { BanknotesIcon, BookIcon, LikeIcon } from '../Icons/Icons';
import { User } from '../../store/types/user.types';

export interface PostFooterProps extends HTMLAttributes<HTMLDivElement> {
  post: Post;
}

export interface PostFooterState {
  usersThatLikedPost: User[];
}

const initialState: PostFooterState = {
  usersThatLikedPost: [],
};

const PostFooter: FC<PostFooterProps> = ({ post, ...props }) => {
  const [state, setState] = useState({ ...initialState, usersThatLikedPost: post.reactions });

  const handleLikeClick = async () => {};

  return (
    <footer {...props}>
      <button
        type='button'
        className='inline-flex justify-center items-center text-center text-gray-500 font-medium p-2 hover:bg-slate-100 transition-[0.3s_ease]'
        onClick={() => handleLikeClick()}
      >
        <LikeIcon className='size-4 me-2 stroke-2' />
        Like
      </button>
      <Link
        href={ApplicationRoutes.PostDetails.replace(':id', post.id)}
        className='inline-flex justify-center items-center text-center text-gray-500 font-medium p-2 hover:bg-slate-100 transition-[0.3s_ease]'
      >
        <BookIcon className='size-4 me-2 stroke-2' />
        Read more
      </Link>
      <Link
        href={ApplicationRoutes.PostDetails.replace(':id', post.id)}
        className='inline-flex justify-center items-center text-center text-gray-500 font-medium p-2 hover:bg-slate-100 transition-[0.3s_ease]'
      >
        <BanknotesIcon className='size-4 me-2 stroke-2' />
        Donate
      </Link>
    </footer>
  );
};

export default PostFooter;
