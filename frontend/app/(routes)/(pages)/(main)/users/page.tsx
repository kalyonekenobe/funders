import { getAuthenticatedUser } from '@/app/(core)/actions/auth.actions';
import { getAllUsers } from '@/app/(core)/actions/user.actions';
import { Metadata } from 'next';
import { FC } from 'react';
import UserComponent from '@/app/(core)/ui/User/User';

export const metadata: Metadata = {
  title: 'Users | Funders',
  description: 'Funders - Users Page',
};

const fetchData = async () => {
  const authenticatedUser = await getAuthenticatedUser();

  if (authenticatedUser) {
    const users = await getAllUsers({
      where: { id: { notIn: [authenticatedUser.id] } },
      select: { followers: true },
    });

    return { authenticatedUser, users };
  }

  return { authenticatedUser, users: [] };
};

const UsersPage: FC = async () => {
  const { users } = await fetchData();

  return (
    <div className='flex flex-col'>
      <div className='grid min-[500px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3 p-5'>
        {users.map(user => (
          <UserComponent key={user.id} user={user} className='flex flex-col bg-white rounded p-3' />
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
