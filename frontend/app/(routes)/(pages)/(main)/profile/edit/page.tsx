import { getAuthInfo } from '@/app/(core)/actions/auth.actions';
import { getUser } from '@/app/(core)/actions/user.actions';
import EditProfileForm from '@/app/(core)/ui/User/EditProfileForm';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FC } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: `Edit profile | Funders`,
  description: `Funders - Edit user profile`,
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

const EditProfilePage: FC = async () => {
  const { user } = await fetchData();

  if (!user) {
    notFound();
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='flex flex-col flex-1 bg-white rounded p-10 items-start'>
        <h3 className='font-bold text-2xl mb-10'>Edit profile</h3>
        <EditProfileForm user={user} className='w-full' />
      </div>
    </div>
  );
};

export default EditProfilePage;
