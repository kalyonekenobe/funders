import { getAllPostCategories } from '@/app/(core)/actions/post.actions';
import BackButton from '@/app/(core)/ui/Controls/BackButton';
import CreatePostForm from '@/app/(core)/ui/Post/CreatePostForm';
import { Metadata } from 'next';
import { FC } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: `Create Post | Funders`,
  description: `Funders - Create a new post`,
};

const fetchData = async () => {
  const categories = await getAllPostCategories();

  return { categories };
};

const CreatePostPage: FC = async () => {
  const { categories } = await fetchData();

  return (
    <div className='flex flex-col h-full'>
      <div className='flex flex-col flex-1 bg-white rounded p-5 sm:p-10 items-center justify-center'>
        <div className='flex flex-col flex-1 w-full max-w-5xl'>
          <div className='flex items-center justify-between w-full mb-5'>
            <h3 className='font-bold text-2xl'>Create post</h3>
            <BackButton className='inline-flex items-center justify-center text-center font-medium text-sm text-white bg-neutral-800 hover:bg-neutral-700 transition-[0.3s_ease] px-5 py-1.5 rounded'>
              Back
            </BackButton>
          </div>
          <CreatePostForm categories={categories} className='w-full' />
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
