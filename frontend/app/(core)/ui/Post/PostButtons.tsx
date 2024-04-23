import { FC } from 'react';
import { Post } from '../../store/types/post.types';
import Link from 'next/link';
import { ApplicationRoutes } from '../../utils/routes.utils';

export interface PostButtonsProps {
  post: Post;
}

const PostButtons: FC<PostButtonsProps> = ({ post }) => {
  return (
    <>
      <Link
        href={ApplicationRoutes.PostDetails.replace(':id', post.id)}
        className='inline-flex justify-center items-center text-center font-medium'
      >
        Read more
      </Link>
      <Link
        href={ApplicationRoutes.PostDetails.replace(':id', post.id)}
        className='inline-flex justify-center items-center text-center font-medium'
      >
        Donate
      </Link>
    </>
  );
};

export default PostButtons;
