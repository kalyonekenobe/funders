import { FC } from 'react';
import Link from 'next/link';
import { ApplicationRoutes } from '../../utils/routes.utils';
import Image from 'next/image';
import { getAuthInfo } from '../../actions/auth.actions';
import { resolveImage } from '../../utils/app.utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const fetchData = async () => {
  const authenticatedUser = await getAuthInfo();

  return { authenticatedUser };
};

const UserProfileLink: FC = async () => {
  const { authenticatedUser } = await fetchData();

  return (
    authenticatedUser && (
      <Link
        href={ApplicationRoutes.Profile}
        className='relative flex items-center px-5 py-3 font-semibold text-sm text-slate-500 hover:bg-slate-50 transition-[0.3s_ease]'
      >
        <span className='relative max-h-[28px] h-full aspect-square rounded bg-slate-100 min-[425px]:me-3 overflow-hidden'>
          <Image
            src={resolveImage(authenticatedUser.avatar, 'default-profile-image')}
            alt={`${authenticatedUser.firstName} ${authenticatedUser.lastName}'s profile image`}
            fill={true}
            sizes='100%, 100%'
            className='object-cover'
            priority={true}
          />
        </span>
        <span className='hidden min-[425px]:inline'>
          {authenticatedUser.firstName} {authenticatedUser.lastName}
        </span>
      </Link>
    )
  );
};

export default UserProfileLink;
