import { getAuthInfo } from '@/app/(core)/actions/auth.actions';
import { getUser } from '@/app/(core)/actions/user.actions';
import BackButton from '@/app/(core)/ui/Controls/BackButton';
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
      <div className='flex flex-col flex-1 bg-white rounded p-5 sm:p-10 items-start'>
        <div className='flex items-center justify-between w-full mb-5'>
          <h3 className='font-bold text-2xl'>Edit profile</h3>
          <BackButton className='inline-flex items-center justify-center text-center font-medium text-sm text-white bg-neutral-800 hover:bg-neutral-700 transition-[0.3s_ease] px-5 py-1.5 rounded'>
            Back
          </BackButton>
        </div>
        <EditProfileForm user={user} className='w-full' />
      </div>
    </div>
  );
};

export default EditProfilePage;
