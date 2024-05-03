import { FC } from 'react';
import { PostComment as PostCommentType } from '../../store/types/post-comment.types';
import Image from 'next/image';
import { ApplicationRoutes } from '../../utils/routes.utils';
import Link from 'next/link';
import { resolveImage } from '../../utils/app.utils';
import PostCommentFooter from './PostCommentFooter';
import PostCommentOptionsButton from './PostCommentOptionsButton';
import { GearIcon } from '../Icons/Icons';
import { Post } from '../../store/types/post.types';
import { AuthInfo } from '../../store/types/app.types';

export interface PostCommentProps {
  post: Post;
  comment: PostCommentType;
  authenticatedUser: AuthInfo;
  onRemove?: (comment: PostCommentType) => void;
  onReply?: (comment: PostCommentType) => void;
}

const PostComment: FC<PostCommentProps> = ({
  post,
  comment,
  authenticatedUser,
  onRemove,
  onReply,
  ...props
}) => {
  const intl = Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' });

  return (
    <div {...props}>
      <header className='flex items-center justify-between'>
        <div className='flex items-center'>
          <div className='w-[35px] h-[35px] flex flex-1 aspect-square rounded relative me-3 overflow-hidden'>
            <Image
              src={resolveImage(comment.author?.avatar, 'default-profile-image')}
              alt={`${comment.author?.firstName} ${comment.author?.lastName}'s profile image`}
              fill={true}
              sizes='100%, 100%'
              className='object-cover'
            />
          </div>
          <div className='flex flex-col'>
            <div className='flex'>
              <Link
                href={ApplicationRoutes.UserDetails.replace(':id', comment.authorId)}
                className='inline-flex'
              >
                <p className='text-blue-600 hover:text-blue-700 transition-[0.3s_ease] font-medium text-sm'>
                  {comment.author?.firstName} {comment.author?.lastName}
                </p>
              </Link>
              {comment.parentCommentId !== null && (
                <div className='test-sm flex flex-1'>
                  {' '}
                  <span className='text-sm mx-1'>replies to</span>
                  <Link
                    href={ApplicationRoutes.UserDetails.replace(
                      ':id',
                      comment.parentComment?.author?.id || '',
                    )}
                    className='text-blue-600 hover:text-blue-700 transition-[0.3s_ease] font-medium text-sm'
                  >
                    {comment.parentComment?.author?.firstName}{' '}
                    {comment.parentComment?.author?.lastName}
                  </Link>
                </div>
              )}
            </div>
            <p className='font-medium text-gray-500 text-xs mt-0.5'>
              <span className='text-xs'>{intl.format(new Date(comment.createdAt))}</span>
            </p>
          </div>
        </div>
        <PostCommentOptionsButton
          postComment={comment}
          authenticatedUser={authenticatedUser!}
          onRemove={onRemove}
          className='rounded-full hover:bg-slate-100 aspect-square p-1.5 transition-[0.3s_ease]'
        >
          <GearIcon className='size-5 stroke-[1.5px] text-gray-700' />
        </PostCommentOptionsButton>
      </header>
      <div className='mt-2 whitespace-pre-wrap'>{comment.content}</div>
      <PostCommentFooter
        post={post}
        postComment={comment}
        authenticatedUser={authenticatedUser!}
        onReply={onReply}
      />
      <div className='flex flex-col mt-3 ps-10'>
        {comment.replies?.map(reply => (
          <PostComment
            authenticatedUser={authenticatedUser}
            post={post}
            key={reply.id}
            comment={reply}
            onReply={onReply}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default PostComment;
