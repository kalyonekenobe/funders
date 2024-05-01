import { getPost } from '@/app/(core)/actions/post.actions';
import PaymentForm from '@/app/(core)/ui/Payment/PaymentForm';
import DonatePostButton from '@/app/(core)/ui/Post/DonatePostButton';
import { notFound } from 'next/navigation';
import { FC } from 'react';

export interface PostDetailsPageProps {
  params: { id: string };
}

const fetchData = async (id: string) => {
  const post = await getPost(id, {
    include: {
      author: true,
      donations: true,
      reactions: { include: { user: true }, orderBy: { datetime: 'desc' } },
      comments: true,
      categories: true,
    },
  });

  return { post };
};

const PostDetailsPage: FC<PostDetailsPageProps> = async ({ params }) => {
  const { post } = await fetchData(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className='flex flex-col'>
      <DonatePostButton post={post}>Donate</DonatePostButton>
      {/* <PaymentForm
        post={post}
        className='bg-white rounded shadow-xl max-w-xl flex flex-col text-xl'
      />
      {JSON.stringify(post)} */}
    </div>
  );
};

export default PostDetailsPage;
