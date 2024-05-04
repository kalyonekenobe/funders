import { getAllPosts } from '@/app/(core)/actions/post.actions';
import PostComponent from '@/app/(core)/ui/Post/Post';
import { FC } from 'react';
import { Metadata } from 'next';
import FriendsAndSuggestions from '@/app/(core)/ui/FriendsAndSuggestions/FriendsAndSuggestions';
import { getAuthInfo } from '@/app/(core)/actions/auth.actions';
import { Permissions } from '@/app/(core)/store/types/user.types';
import { PlusIcon } from '@/app/(core)/ui/Icons/Icons';
import Link from 'next/link';
import { ApplicationRoutes } from '@/app/(core)/utils/routes.utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Home | Funders',
  description: 'Funders - Home Page',
};

const fetchData = async () => {
  const authenticatedUser = await getAuthInfo();

  const posts = await getAllPosts({
    where: {
      isDraft: false,
    },
    include: {
      author: true,
      donations: true,
      reactions: { include: { user: true }, orderBy: { datetime: 'desc' } },
      comments: true,
      categories: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return { authenticatedUser, posts };
};

const HomePage: FC = async () => {
  const { authenticatedUser, posts } = await fetchData();

  return (
    <div className='grid lg:grid-cols-[6fr_3fr] xl:grid-cols-[7fr_2.5fr] 2xl:grid-cols-[8fr_2fr] h-full'>
      <div className='flex flex-col flex-1 relative mt-5'>
        <div className='flex flex-col flex-1 items-center'>
          <div className='flex justify-between w-full max-w-3xl px-5 items-center mb-5'>
            <h3 className='text-gray-600 font-bold text-xl'>Posts</h3>
            {((authenticatedUser?.permissions ?? 0) & Permissions.MANAGE_POSTS) ===
              Permissions.MANAGE_POSTS && (
              <Link
                href={ApplicationRoutes.PostCreate}
                className='inline-flex items-center justify-center text-center bg-rose-600 rounded px-2 py-1 text-white font-medium text-sm hover:bg-rose-500 transition-[0.3s_ease]'
              >
                <PlusIcon className='size-4 stroke-2 me-1' />
                Create post
              </Link>
            )}
          </div>
          <div className='grid gap-3 flex-1 px-5 pb-5 overflow-y-scroll max-w-3xl'>
            {posts.map(post => (
              <PostComponent
                key={post.id}
                post={post}
                className='border border-slate-100 rounded bg-white'
              />
            ))}
          </div>
        </div>
      </div>
      <div className='hidden lg:flex sticky top-[calc(3.5rem_+_1px)] h-full max-h-[calc(100vh_-_3.5rem_-_1px)] flex-1 flex-col self-start'>
        <FriendsAndSuggestions className='sticky top-0 w-full flex flex-col flex-1 bg-white z-50 border-l border-gray-100' />
      </div>
    </div>
  );
};

export default HomePage;
