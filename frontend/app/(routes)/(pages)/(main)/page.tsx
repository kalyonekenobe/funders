import { getAllPosts } from '@/app/(core)/actions/post.actions';
import Post from '@/app/(core)/ui/Post/Post';
import { FC } from 'react';
import { Post as PostType } from '@/app/(core)/store/types/post.types';
import { QueryStringOptions } from '@/app/(core)/utils/query-string.utils';
import { Metadata } from 'next';

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
    <div className='grid gap-3 max-w-2xl mx-auto'>
      {posts.map(post => (
        <Post key={post.id} post={post} className='border rounded-xl bg-white' />
      ))}
    </div>
  );
};

export default Home;
