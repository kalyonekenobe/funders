import { getAllPosts } from '@/app/(core)/actions/post.actions';
import Post from '@/app/(core)/ui/Post/Post';
import { FC } from 'react';
import { Post as PostType } from '@/app/(core)/store/types/post.types';
import { QueryStringOptions } from '@/app/(core)/utils/query-string.utils';
import { Metadata } from 'next';
import FriendsAndSuggestions from '@/app/(core)/ui/FriendsAndSuggestions/FriendsAndSuggestions';

export const metadata: Metadata = {
  title: 'Home | Funders',
  description: 'Funders - Home Page',
};

const Home: FC = async () => {
  const posts = await getAllPosts({
    include: { author: true, donations: true },
    orderBy: { createdAt: 'desc' },
  } as QueryStringOptions<PostType>);

  return (
    <div className='grid lg:grid-cols-[6fr_3fr] xl:grid-cols-[7fr_2.5fr] 2xl:grid-cols-[8fr_2fr]'>
      <div className='flex flex-col flex-1 relative mt-5'>
        {/* <div className='sticky top-0 grid grid-cols-2 self-center bg-white mb-3 divide-x border-b border-r m-5'>
          <Link
            href={ApplicationRoutes.Home}
            className='text-center font-medium p-3 text-gray-500 bg-slate-100'
          >
            Global feed
          </Link>
          <Link
            href={ApplicationRoutes.Home}
            className='text-center font-medium p-3 text-gray-500 '
          >
            Your feed
          </Link>
        </div> */}
        <div className='flex flex-1 justify-center'>
          <div className='grid gap-3 flex-1 px-5 pb-5 overflow-y-scroll max-w-3xl'>
            {posts.map(post => (
              <Post
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

export default Home;
