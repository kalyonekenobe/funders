import { getPost } from '@/app/(core)/actions/post.actions';
import Image from 'next/image';
import DonatePostButton from '@/app/(core)/ui/Post/DonatePostButton';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import { resolveImage } from '@/app/(core)/utils/app.utils';
import { ApplicationRoutes } from '@/app/(core)/utils/routes.utils';
import Link from 'next/link';
import PostOptionsButton from '@/app/(core)/ui/Post/PostOptionsButton';
import { BanknotesIcon, GearIcon } from '@/app/(core)/ui/Icons/Icons';
import { getAuthInfo } from '@/app/(core)/actions/auth.actions';
import Progress from '@/app/(core)/ui/Progress/Progress';
import { PostComment as PostCommentType } from '@/app/(core)/store/types/post-comment.types';
import PostComment from '@/app/(core)/ui/Post/PostComment';
import BackButton from '@/app/(core)/ui/Controls/BackButton';
import PostDetailsLikeButton from '@/app/(core)/ui/Post/PostDetailsLikeButton';

export interface PostDetailsPageProps {
  params: { id: string };
}

const getRootParentId = (
  comment: PostCommentType | undefined,
  comments: PostCommentType[],
): PostCommentType['id'] | undefined => {
  if (!comment) return comment;
  if (comment.parentCommentId === null) return comment.id;
  return getRootParentId(
    comments.find(c => c.id === comment.parentCommentId),
    comments,
  );
};

const prepareComments = (comments: PostCommentType[]): PostCommentType[] => {
  const rootComments = comments.filter(comment => comment.parentCommentId === null);
  rootComments.forEach(comment => {
    comment.replies = [];
    comments.forEach(c => {
      if (c.id !== comment.id && getRootParentId(c, comments) === comment.id) {
        c.parentComment = comments.find(cc => cc.id === c.parentCommentId);
        comment.replies!.push(c);
      }
    });
  });
  return rootComments;
};

const fetchData = async (id: string) => {
  const authenticatedUser = await getAuthInfo();

  const post = await getPost(id, {
    include: {
      author: true,
      donations: true,
      reactions: { include: { user: true }, orderBy: { datetime: 'desc' } },
      comments: {
        include: {
          author: true,
          reactions: { include: { user: true }, orderBy: { datetime: 'desc' } },
        },
        orderBy: { createdAt: 'asc' },
      },
      categories: true,
    },
  });

  return { authenticatedUser, post };
};

export const generateMetadata = async ({ params }: PostDetailsPageProps): Promise<Metadata> => {
  const { post } = await fetchData(params.id);

  return {
    title: `"${post?.title}" | Funders`,
    description: `Funders - Post: "${post?.title}"`,
  };
};

const PostDetailsPage: FC<PostDetailsPageProps> = async ({ params }) => {
  const { authenticatedUser, post } = await fetchData(params.id);
  const intl = Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' });

  if (!post) {
    notFound();
  }

  return (
    <div className='flex flex-col p-5 sm:p-10 bg-white items-center'>
      <div className='flex flex-col max-w-5xl'>
        <div className='flex justify-between items-center border-b pb-5'>
          <Link
            href={ApplicationRoutes.UserDetails.replace(':id', post.authorId)}
            className='inline-flex'
          >
            <div className='flex items-center'>
              <div className='w-[35px] h-[35px] flex flex-1 aspect-square rounded relative me-3 overflow-hidden'>
                <Image
                  src={resolveImage(post.author?.avatar, 'default-profile-image')}
                  alt={`${post.author?.firstName} ${post.author?.lastName}'s profile image`}
                  fill={true}
                  sizes='100%, 100%'
                  className='object-cover'
                />
              </div>
              <div className='flex flex-col'>
                <p className='text-blue-600 hover:text-blue-700 transition-[0.3s_ease] font-medium text-sm'>
                  {post.author?.firstName} {post.author?.lastName}
                </p>
                <p className='font-medium text-gray-500 text-xs mt-0.5'>
                  <span className='text-xs'>{intl.format(new Date(post.createdAt))}</span>
                </p>
              </div>
            </div>
          </Link>
          <div className='inline-flex gap-3 items-center'>
            <BackButton className='inline-flex items-center bg-neutral-800 text-xs sm:text-base text-white font-medium px-2 sm:px-5 py-1 rounded hover:bg-neutral-700 transition-[0.3s_ease]'>
              Back
            </BackButton>
            <PostOptionsButton
              post={post}
              authenticatedUser={authenticatedUser!}
              className='rounded-full hover:bg-slate-100 aspect-square p-1.5 transition-[0.3s_ease]'
            >
              <GearIcon className='size-5 sm:size-6 stroke-[1.5px] text-gray-700' />
            </PostOptionsButton>
          </div>
        </div>
        <h3 className='text-3xl font-bold mt-5'>
          {post.title}{' '}
          {post.isDraft && (
            <span className='ms-1 bg-neutral-200 px-2 py-0.5 rounded text-base align-middle font-medium text-slate-600'>
              Draft
            </span>
          )}
        </h3>
        <div className='flex gap-2 mt-3 mb-5 flex-wrap'>
          {post.categories?.map(category => (
            <span
              key={category.category}
              className='bg-indigo-400 text-white font-medium text-sm px-2 py-0.5 rounded'
            >
              {category.category}
            </span>
          ))}
        </div>
        <div className='relative flex flex-1 rounded overflow-hidden aspect-video'>
          <Image
            src={resolveImage(post.image, 'post-image-placeholder')}
            className='object-cover'
            alt={post.title}
            fill={true}
            sizes='100%, 100%'
            priority={true}
          />
        </div>
        <PostDetailsLikeButton post={post} authenticatedUser={authenticatedUser!} />
        <div className='flex flex-col w-full mt-5'>
          <div className='flex justify-between items-center mb-2'>
            <h4 className='text-gray-500 font-bold mb-2 text-xl'>Donation progress</h4>
            <DonatePostButton
              post={post}
              className='inline-flex items-center bg-emerald-500 text-white font-medium px-5 py-1 rounded hover:bg-emerald-600 transition-[0.3s_ease]'
            >
              <BanknotesIcon className='size-4 stroke-2 me-2' />
              Donate
            </DonatePostButton>
          </div>
          <Progress
            current={
              post.donations?.reduce(
                (previousValue, currentValue) => (previousValue += Number(currentValue.donation)),
                0,
              ) ?? 0
            }
            goal={Number(post.fundsToBeRaised)}
            height={32}
            measure='$'
          />
        </div>
        <p className='whitespace-pre-wrap text-xl mt-10'>{post.content}</p>
        <h4 className='text-gray-500 font-bold mt-10 mb-5 text-xl'>Comments</h4>
        <div id='comments' className='flex flex-col gap-3'>
          {prepareComments(post.comments ?? []).map(comment => (
            <PostComment key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPage;
