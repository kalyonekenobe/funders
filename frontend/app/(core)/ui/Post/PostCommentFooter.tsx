'use client';

import { FC, HTMLAttributes, useState } from 'react';
import { LikeIcon } from '../Icons/Icons';
import { User } from '../../store/types/user.types';
import { addPostCommentReaction, removePostCommentReaction } from '../../actions/post.actions';
import { UserReactionTypeEnum } from '../../store/types/user-reaction-type.types';
import { AuthInfo } from '../../store/types/app.types';
import useNotification from '../../hooks/notifications.hooks';
import { NotificationType } from '../../utils/notifications.utils';
import { PostComment } from '../../store/types/post-comment.types';
import { createPortal } from 'react-dom';
import Modal from '../Modal/Modal';
import UserListItem from '../User/UserListItem';

export interface PostCommentFooterProps extends HTMLAttributes<HTMLDivElement> {
  postComment: PostComment;
  authenticatedUser: AuthInfo;
}

export interface PostCommentFooterState {
  usersThatLikedPostComment: User[];
  isLiked: boolean;
  isUserThatLikedPostCommentListVisible: boolean;
}

const initialState: PostCommentFooterState = {
  usersThatLikedPostComment: [],
  isLiked: false,
  isUserThatLikedPostCommentListVisible: false,
};

const PostCommentFooter: FC<PostCommentFooterProps> = ({
  postComment,
  authenticatedUser,
  ...props
}) => {
  const [state, setState] = useState({
    ...initialState,
    usersThatLikedPostComment: (postComment.reactions ?? []).map(reaction => reaction.user!),
    isLiked: Boolean(
      (postComment.reactions ?? []).find(reaction => reaction.userId === authenticatedUser.userId),
    ),
  });
  const { createNotification } = useNotification();

  const handleLikeClick = async () => {
    if (!state.isLiked) {
      const response = await addPostCommentReaction(postComment.id, UserReactionTypeEnum.Like);

      if (!response || response.error) {
        createNotification({
          type: NotificationType.Error,
          message: response.error || 'Cannot add reaction to the post comment',
        });
      } else {
        setState({
          ...state,
          isLiked: true,
          usersThatLikedPostComment: [
            { ...authenticatedUser, id: authenticatedUser.userId } as any,
            ...state.usersThatLikedPostComment,
          ],
        });
      }
    } else {
      const response = await removePostCommentReaction(postComment.id);

      if (!response || response.error) {
        createNotification({
          type: NotificationType.Error,
          message: response.error || 'Cannot remove reaction from the post comment',
        });
      } else {
        setState({
          ...state,
          isLiked: false,
          usersThatLikedPostComment: state.usersThatLikedPostComment.filter(
            user => user.id !== authenticatedUser.userId,
          ),
        });
      }
    }
  };

  return (
    <>
      {state.isUserThatLikedPostCommentListVisible &&
        createPortal(
          <Modal
            className='max-w-xl'
            title={`Likes`}
            buttons={[
              {
                type: 'close',
                name: 'Close',
                action: () => setState({ ...state, isUserThatLikedPostCommentListVisible: false }),
              },
            ]}
          >
            <div className='flex flex-col gap-1 p-3'>
              {state.usersThatLikedPostComment.map(user => (
                <UserListItem
                  key={user.id}
                  id={user.id}
                  firstName={user.firstName || ''}
                  lastName={user.lastName || ''}
                  avatar={user.avatar || null}
                  className='inline-flex items-center rounded p-1 hover:bg-slate-100 transition-[0.3s_ease]'
                />
              ))}
              {!state.usersThatLikedPostComment.length && (
                <div className='min-h-[50px] flex items-center justify-center rounded-xl border-[3px] border-dashed'>
                  <h3 className='text-gray-400 font-semibold text-center'>
                    Nobody has liked this post comment yet
                  </h3>
                </div>
              )}
            </div>
          </Modal>,
          document.querySelector('body')!,
        )}
      <footer {...props}>
        <div className='flex gap-1'>
          <span
            className='inline-flex text-sm items-center text-gray-600 cursor-pointer hover:text-gray-800 transition-[0.3s_ease]'
            onClick={() => setState({ ...state, isUserThatLikedPostCommentListVisible: true })}
          >
            {state.usersThatLikedPostComment.length} likes
          </span>
          <button
            type='button'
            className={`text-xs rounded inline-flex justify-center items-center text-center font-medium p-2 hover:bg-slate-100 transition-[0.3s_ease] ${
              state.isLiked ? 'text-red-600' : 'text-gray-500'
            }`}
            onClick={() => handleLikeClick()}
          >
            <LikeIcon className='size-3.5 me-2 stroke-2' solid={state.isLiked} />
            {state.isLiked ? 'You liked' : 'Like'}
          </button>
        </div>
      </footer>
    </>
  );
};

export default PostCommentFooter;
