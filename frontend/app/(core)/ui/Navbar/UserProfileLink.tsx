import { FC } from 'react';
import Link from 'next/link';
import { ApplicationRoutes } from '../../utils/routes.utils';
import Image from 'next/image';
import { getAuthenticatedUser } from '../../actions/auth.actions';

const UserProfileLink: FC = async () => {
  const authenticatedUser = await getAuthenticatedUser();

  return (
    authenticatedUser && (
      <Link
        href={ApplicationRoutes.Profile}
        className='relative flex items-center px-5 py-3 font-semibold text-sm text-slate-500 hover:bg-slate-50 transition-[0.3s_ease]'
      >
        <span className='relative max-h-[28px] h-full aspect-square rounded-full bg-slate-100 me-3 overflow-hidden'>
          <Image
            src={
              authenticatedUser.avatar ||
              process.env.NEXT_PUBLIC_DEFAULT_PROFILE_IMAGE_SRC ||
              '/default-profile-image.webp'
            }
            alt={`${authenticatedUser.firstName} ${authenticatedUser.lastName}'s profile image`}
            fill={true}
            sizes='32px, 32px'
            className='object-cover'
          />
        </span>
        <span className='hidden sm:inline'>
          {authenticatedUser.firstName} {authenticatedUser.lastName}
        </span>
      </Link>
    )
  );
};

export default UserProfileLink;
