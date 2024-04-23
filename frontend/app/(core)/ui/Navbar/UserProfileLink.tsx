'use client';

import { FC } from 'react';
import { useAuth } from '../../hooks/auth.hooks';
import Link from 'next/link';
import { ApplicationRoutes } from '../../utils/routes.utils';
import Image from 'next/image';

const UserProfileLink: FC = () => {
  const { authenticatedUser } = useAuth();

  return (
    authenticatedUser && (
      <Link
        href={ApplicationRoutes.Profile}
        className='relative flex items-center px-5 py-4 font-medium text-slate-500 hover:bg-slate-50 transition-[0.3s_ease]'
      >
        <span className='relative max-h-[28px] h-full aspect-square rounded-full bg-slate-100 border border-slate-300 me-3 overflow-hidden'>
          <Image
            src={
              authenticatedUser.avatar ||
              process.env.NEXT_PUBLIC_DEFAULT_PROFILE_IMAGE_SRC ||
              '/default-profile-image.webp'
            }
            alt={`${authenticatedUser.firstName} ${authenticatedUser.lastName}'s profile image`}
            fill={true}
            sizes='32px, 32px'
          />
        </span>
        {authenticatedUser.firstName} {authenticatedUser.lastName}
      </Link>
    )
  );
};

export default UserProfileLink;
