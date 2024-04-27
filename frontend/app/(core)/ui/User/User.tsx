import { FC, HTMLAttributes } from 'react';
import { User as UserType } from '../../store/types/user.types';
import Image from 'next/image';
import Link from 'next/link';
import { ApplicationRoutes } from '../../utils/routes.utils';
import { UserRoleEnum } from '../../store/types/user-role.types';

export interface UserProps extends HTMLAttributes<HTMLDivElement> {
  user: UserType;
}

const User: FC<UserProps> = ({ user, ...props }) => {
  return (
    <div {...props}>
      <div className='flex flex-1 flex-col justify-between'>
        <header className='flex flex-col items-center w-full'>
          <div className='flex flex-1 w-full max-w-[92px] relative overflow-hidden rounded-full aspect-square'>
            <Image
              src={
                user.avatar ||
                process.env.NEXT_PUBLIC_DEFAULT_PROFILE_IMAGE_SRC ||
                '/default-profile-image.webp'
              }
              alt={`${user.firstName} ${user.lastName}'s profile image`}
              sizes='256px, 256px'
              className='object-cover'
              fill={true}
              priority={true}
            />
          </div>
          <h3 className='text-gray-600 mt-5 font-bold text-center'>
            {user.firstName} {user.lastName}
          </h3>
          <span
            className={`text-xs font-semibold text-white px-2 rounded-full mt-0.5 mb-5 ${
              user.role === UserRoleEnum.Default
                ? 'bg-emerald-500'
                : user.role === UserRoleEnum.Volunteer
                  ? 'bg-violet-500'
                  : 'bg-rose-500'
            }`}
          >
            {user.role === UserRoleEnum.Default ? 'Member' : user.role}
          </span>
          <p className='mb-5 text-sm text-gray-500'>{user.bio || 'No bio yet'}</p>
        </header>
        <footer className='flex flex-col gap-1.5 w-full'>
          <Link
            href={ApplicationRoutes.UserDetails.replace(':id', user.id)}
            className='inline-flex p-1 text-center justify-center rounded bg-slate-200 text-gray-500 font-medium text-sm  hover:bg-slate-200 hover:text-gray-700 transition-[0.3s_ease]'
          >
            View profile
          </Link>
          <Link
            href={ApplicationRoutes.UserDetails.replace(':id', user.id)}
            className='inline-flex p-1 text-center justify-center rounded bg-rose-500 text-white font-medium text-sm hover:ring-2 hover:ring-rose-500 hover:ring-inset hover:text-rose-500 hover:bg-transparent transition-[0.3s_ease]'
          >
            {
              // !user.followers?.find(follower => follower.id === ) &&
              'Subscribe'
            }
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default User;
