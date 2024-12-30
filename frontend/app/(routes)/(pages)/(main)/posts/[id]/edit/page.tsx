import { getAllPostCategories, getPost } from '@/app/(core)/actions/post.actions';
import BackButton from '@/app/(core)/ui/Controls/BackButton';
import EditPostForm from '@/app/(core)/ui/Post/EditPostForm';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FC } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: `Edit Post | Funders`,
  description: `Funders - Edit a post`,
};

export interface EditPostPageProps {
  params: { id: string };
}

const fetchData = async (id: string) => {
  const categories = await getAllPostCategories();
  const post = await getPost(id, {
    include: {
      categories: true,
      attachments: true,
    },
  });

  return { post, categories };
};

const EditPostPage: FC<EditPostPageProps> = async ({ params }) => {
  const { categories, post } = await fetchData(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='flex flex-col flex-1 bg-white rounded p-5 sm:p-10 items-center justify-center'>
        <div className='flex flex-col flex-1 w-full max-w-5xl'>
          <div className='flex items-center justify-between w-full mb-5'>
            <h3 className='font-bold text-2xl'>Edit post</h3>
            <BackButton className='inline-flex items-center justify-center text-center font-medium text-sm text-white bg-neutral-800 hover:bg-neutral-700 transition-[0.3s_ease] px-5 py-1.5 rounded'>
              Back
            </BackButton>
          </div>
          <EditPostForm categories={categories} post={post} className='w-full' />
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;
