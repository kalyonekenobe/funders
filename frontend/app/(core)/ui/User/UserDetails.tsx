import { FC, HTMLAttributes } from 'react';
import { User } from '../../store/types/user.types';
import PostComponent from '../Post/Post';
import Image from 'next/image';
import { UserRoleEnum } from '../../store/types/user-role.types';
import BackButton from '../Controls/BackButton';
import { getAuthInfo } from '../../actions/auth.actions';
import UserDetailsProfileFooter from './UserDetailsProfileFooter';
import { resolveImage } from '../../utils/app.utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface UserDetailsProps extends HTMLAttributes<HTMLDivElement> {
  user: User;
}

const fetchData = async () => {
  const authenticatedUser = await getAuthInfo();

  return { authenticatedUser };
};

const UserDetails: FC<UserDetailsProps> = async ({ user, ...props }) => {
  const { authenticatedUser } = await fetchData();
  const intl = Intl.DateTimeFormat('en-US', { dateStyle: 'long' });

  return (
    <div {...props}>
      <div className='bg-white'>
        <div className='flex flex-1 h-80 w-full overflow-hidden relative'>
          <Image
            src={resolveImage(undefined, 'profile-background-placeholder')}
            alt={`${user.firstName} ${user.lastName}'s profile image`}
            sizes='1920px, 1080px'
            fill={true}
            priority={true}
            className='object-cover'
          />
        </div>
        <header className='grid grid-cols-1 lg:grid-cols-[1fr_100px] items-start mx-auto p-5 sm:p-10'>
          <div className='lg:order-first flex flex-col lg:flex-row items-center lg:items-start w-full'>
            <div className='relative flex aspect-square rounded overflow-hidden w-full max-w-[128px] my-5 lg:m-0 self-start'>
              <Image
                src={resolveImage(user.avatar, 'default-profile-image')}
                alt={`${user.firstName} ${user.lastName}'s profile image`}
                sizes='256px, 256px'
                fill={true}
                className='object-cover'
              />
            </div>
            <div className='flex flex-col mx-5 lg:mx-10 items-start w-full'>
              <h3 className='font-bold text-2xl'>
                {user.firstName} {user.lastName}
              </h3>
              <span
                className={`text-xs font-semibold text-white px-2 rounded-full mt-0.5 ${
                  user.role === UserRoleEnum.Default
                    ? 'bg-emerald-500'
                    : user.role === UserRoleEnum.Volunteer
                      ? 'bg-violet-500'
                      : 'bg-rose-500'
                }`}
              >
                {user.role === UserRoleEnum.Default ? 'Member' : user.role}
              </span>
              <span className='text-xs text-gray-800 mt-1.5'>
                Registered at: <span>{intl.format(new Date(user.registeredAt))}</span>
              </span>
              <p className='my-5 text-gray-500 text-sm whitespace-pre-wrap'>
                {user.bio || 'No bio yet'}
              </p>
              <UserDetailsProfileFooter
                user={user}
                authenticatedUser={authenticatedUser!}
                className='flex flex-col'
              />
            </div>
          </div>
          <div className='order-first lg:order-last flex justify-end flex-1'>
            <BackButton className='font-medium text-sm text-white bg-neutral-800 rounded px-5 py-1 hover:bg-neutral-700 transition-[0.3s_ease]'>
              Back
            </BackButton>
          </div>
        </header>
      </div>
      <div className='flex flex-1 flex-col p-5'>
        {!user.posts?.length ? (
          <div className='flex flex-1 w-full items-center justify-center'>
            <h3 className='text-gray-400 font-semibold text-center text-xl p-5'>
              {user.firstName} {user.lastName} does not have any posts yet
            </h3>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-3 flex-1 md:px-5 md:pb-5 overflow-y-scroll mx-auto w-full max-w-3xl'>
            {user.posts?.map(post => (
              <PostComponent
                key={post.id}
                post={{ ...post, author: user }}
                className='border border-slate-100 rounded bg-white'
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
