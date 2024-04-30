import { getAuthInfo } from '@/app/(core)/actions/auth.actions';
import { getUser } from '@/app/(core)/actions/user.actions';
import UserDetails from '@/app/(core)/ui/User/UserDetails';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FC } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: `Profile | Funders`,
  description: `Funders - User profile`,
};

const fetchData = async () => {
  const authenticatedUser = await getAuthInfo();

  if (authenticatedUser) {
    const user = await getUser(authenticatedUser.userId, {
      select: {
        posts: true,
        followers: { include: { follower: true } },
        followings: { include: { user: true } },
      },
    });

    return { user };
  }

  return { user: null };
};

const ProfilePage: FC = async () => {
  const { user } = await fetchData();

  if (!user) {
    notFound();
  }

  return (
    <div className='flex flex-col'>
      <UserDetails user={user} />
    </div>
  );
};

export default ProfilePage;
