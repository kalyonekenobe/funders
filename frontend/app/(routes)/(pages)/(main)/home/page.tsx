import { getAllPosts } from '@/app/(core)/actions/post.actions';
import PostComponent from '@/app/(core)/ui/Post/Post';
import { FC } from 'react';
import { Metadata } from 'next';
import FriendsAndSuggestions from '@/app/(core)/ui/FriendsAndSuggestions/FriendsAndSuggestions';

export const metadata: Metadata = {
  title: 'Home | Funders',
  description: 'Funders - Home Page',
};

const fetchData = async () => {
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

  return { posts };
};

const HomePage: FC = async () => {
  const { posts } = await fetchData();

  return (
    <div className='grid lg:grid-cols-[6fr_3fr] xl:grid-cols-[7fr_2.5fr] 2xl:grid-cols-[8fr_2fr] h-full'>
      <div className='flex flex-col flex-1 relative mt-5'>
        <div className='flex flex-1 justify-center'>
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
