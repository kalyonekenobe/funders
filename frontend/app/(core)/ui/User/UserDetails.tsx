import { FC, HTMLAttributes } from 'react';
import { User } from '../../store/types/user.types';
import PostComponent from '../Post/Post';
import Image from 'next/image';

export interface UserDetailsProps extends HTMLAttributes<HTMLDivElement> {
  user: User;
}

const UserDetails: FC<UserDetailsProps> = async ({ user, ...props }) => {
  return (
    <div {...props}>
      <div className='bg-white p-5'>
        <header className='flex flex-wrap sm:flex-nowrap'>
          <div className='relative flex flex-1 aspect-square rounded-full overflow-hidden max-w-[128px]'>
            <Image
              src={
                user.avatar ||
                process.env.NEXT_PUBLIC_DEFAULT_PROFILE_IMAGE_SRC ||
                '/default-profile-image.webp'
              }
              alt={`${user.firstName} ${user.lastName}'s profile image`}
              sizes='256px, 256px'
              fill={true}
              priority={true}
            />
          </div>
        </header>
      </div>
      <div className='flex justify-center p-5'>
        <div className='grid gap-3 flex-1 px-5 pb-5 overflow-y-scroll max-w-3xl'>
          {user.posts?.map(post => (
            <PostComponent
              key={post.id}
              post={{ ...post, author: user }}
              className='border border-slate-100 rounded bg-white'
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
