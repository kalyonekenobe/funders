import { FC, HTMLAttributes } from 'react';
import { Post as PostType } from '../../store/types/post.types';
import Image from 'next/image';
import PostButtons from './PostButtons';
import { ApplicationRoutes } from '../../utils/routes.utils';
import Link from 'next/link';
import Progress from '../Progress/Progress';
import PostOptionsButton from './PostOptionsButton';
import { GearIcon } from '../Icons/Icons';
import { resolveImage } from '../../utils/app.utils';

export interface PostProps extends HTMLAttributes<HTMLDivElement> {
  post: PostType;
}

const Post: FC<PostProps> = ({ post, ...props }) => {
  const intl = Intl.DateTimeFormat('en-US', { dateStyle: 'long' });

  return (
    <article {...props}>
      <div className='flex flex-col p-5'>
        <header>
          <div className='flex justify-between items-center mb-5'>
            <Link
              href={ApplicationRoutes.UserDetails.replace(':id', post.authorId)}
              className='inline-flex'
            >
              <div className='flex items-center'>
                <div className='w-[35px] h-[35px] flex flex-1 aspect-square rounded relative me-3 overflow-hidden'>
                  <Image
                    src={resolveImage(post.author?.avatar, 'default-profile-image')}
                    alt={`${post.author?.firstName} ${post.author?.lastName}'s profile image`}
                    fill={true}
                    sizes='64px, 64px'
                    className='object-cover'
                  />
                </div>
                <div className='flex flex-col'>
                  <p className='text-blue-600 hover:text-blue-700 transition-[0.3s_ease] font-medium text-sm'>
                    {post.author?.firstName} {post.author?.lastName}
                  </p>
                  <p className='font-medium text-gray-500 text-xs mt-0.5'>
                    <span className='text-xs'>{intl.format(new Date(post.createdAt))}</span>
                  </p>
                </div>
              </div>
            </Link>
            <PostOptionsButton
              post={post}
              className='rounded-full hover:bg-slate-100 aspect-square p-1.5 transition-[0.3s_ease]'
            >
              <GearIcon className='size-5 stroke-[1.5px] text-gray-700' />
            </PostOptionsButton>
          </div>
          <div className='flex relative aspect-video rounded overflow-hidden'>
            <Image
              src={resolveImage(post.image, 'post-image-placeholder')}
              className='object-cover'
              alt={post.title}
              fill={true}
              sizes='100%, 100%'
              priority={true}
            />
          </div>
          <h3 className='font-bold text-2xl mt-3'>{post.title}</h3>
        </header>
        <div className='flex flex-col w-full mt-5'>
          <Progress
            current={
              post.donations?.reduce(
                (previousValue, currentValue) => (previousValue += Number(currentValue.donation)),
                0,
              ) ?? 0
            }
            goal={Number(post.fundsToBeRaised)}
            height={16}
            measure='$'
          />
        </div>
      </div>
      <footer className='grid grid-cols-3 border-t'>
        <PostButtons post={post} />
      </footer>
    </article>
  );
};

export default Post;
