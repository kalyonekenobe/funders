import { FC, HTMLAttributes } from 'react';
import { Post as PostType } from '../../store/types/post.types';
import Image from 'next/image';
import PostButtons from './PostButtons';
import { ApplicationRoutes } from '../../utils/routes.utils';
import Link from 'next/link';
import Progress from '../Progress/Progress';

export interface PostProps extends HTMLAttributes<HTMLDivElement> {
  post: PostType;
}

const Post: FC<PostProps> = ({ post, ...props }) => {
  return (
    <article {...props}>
      <div className='p-5'>
        <header>
          <div className='flex relative aspect-video rounded-xl overflow-hidden'>
            <Image
              src={
                post.image ||
                process.env.NEXT_PUBLIC_POST_IMAGE_PLACEHOLDER_SRC ||
                '/post-image-placeholder.webp'
              }
              className='object-cover'
              alt={post.title}
              fill={true}
              sizes='100%, 100%'
            />
          </div>
          <h3 className='font-bold text-2xl mt-3'>{post.title}</h3>
          <div className='flex flex-col my-3'>
            <p className='font-medium text-gray-500 text-sm'>
              Author:{' '}
              <Link
                href={ApplicationRoutes.UserDetails.replace(':id', post.authorId)}
                className='text-blue-600 hover:text-blue-700 hover:border-b hover:border-blue-700 transition-[0.3s_ease]'
              >
                {post.author?.firstName} {post.author?.lastName}
              </Link>
            </p>
            <p className='font-medium text-gray-500 text-sm mt-1'>
              Posted on <span className='text-sm'>{new Date(post.createdAt).toLocaleString()}</span>
            </p>
          </div>
        </header>
        <div className='flex flex-col'>
          <Progress
            current={
              post.donations?.reduce(
                (previousValue, currentValue) => (previousValue += Number(currentValue.donation)),
                0,
              ) ?? 0
            }
            goal={Number(post.fundsToBeRaised)}
            height={20}
            measure='$'
          />
        </div>
      </div>
      <footer className='grid grid-cols-2 gap-2 mt-5'>
        <PostButtons post={post} />
      </footer>
    </article>
  );
};

export default Post;
