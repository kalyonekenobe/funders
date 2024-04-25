import { FC } from 'react';
import { Post } from '../../store/types/post.types';
import Link from 'next/link';
import { ApplicationRoutes } from '../../utils/routes.utils';
import { BanknotesIcon, BookIcon, LikeIcon } from '../Icons/Icons';

export interface PostButtonsProps {
  post: Post;
}

const PostButtons: FC<PostButtonsProps> = ({ post }) => {
  return (
    <>
      <Link
        href={ApplicationRoutes.PostDetails.replace(':id', post.id)}
        className='inline-flex justify-center items-center text-center text-gray-500 font-medium p-2 hover:bg-slate-100 transition-[0.3s_ease]'
      >
        <LikeIcon className='size-4 me-2 stroke-2' />
        Like
      </Link>
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
    </>
  );
};

export default PostButtons;
