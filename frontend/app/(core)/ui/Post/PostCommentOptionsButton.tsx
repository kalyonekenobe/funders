'use client';

import { ButtonHTMLAttributes, FC, useState } from 'react';
import { useOutsideClick } from '../../hooks/dom.hooks';
import { EditIcon, FlagIcon, RemoveIcon } from '../Icons/Icons';
import { AuthInfo } from '../../store/types/app.types';
import { createPortal } from 'react-dom';
import Modal from '../Modal/Modal';
import { NotificationType } from '../../utils/notifications.utils';
import useNotification from '../../hooks/notifications.hooks';
import { useRouter } from 'next/navigation';
import { PostComment } from '../../store/types/post-comment.types';
import { removePostComment } from '../../actions/post.actions';

export interface PostCommentOptionsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  postComment: PostComment;
  authenticatedUser: AuthInfo;
}

export interface PostCommentOptionsButtonState {
  isPostCommentOptionsDropdownVisible: boolean;
  isRemovePostCommentModalVisible: boolean;
}

const initialState: PostCommentOptionsButtonState = {
  isPostCommentOptionsDropdownVisible: false,
  isRemovePostCommentModalVisible: false,
};

const PostCommentOptionsButton: FC<PostCommentOptionsButtonProps> = ({
  postComment,
  authenticatedUser,
  children,
  ...props
}) => {
  const [state, setState] = useState(initialState);
  const ref = useOutsideClick(() =>
    setState({ ...state, isPostCommentOptionsDropdownVisible: false }),
  );
  const { createNotification } = useNotification();
  const router = useRouter();

  return (
    <>
      {state.isRemovePostCommentModalVisible &&
        createPortal(
          <Modal
            className='max-w-xl'
            title={'Delete post comment'}
            buttons={[
              {
                type: 'accept',
                name: 'Confirm',
                variant: 'danger',
                action: async () => {
                  const response = await removePostComment(postComment.id);

                  if (response?.error) {
                    createNotification({
                      type: NotificationType.Error,
                      message:
                        response?.error ??
                        'Cannot delete this post comment. Please, try again later',
                    });
                  } else {
                    createNotification({
                      type: NotificationType.Success,
                      message: 'The post comment was successfully deleted',
                    });
                  }

                  setState({ ...state, isRemovePostCommentModalVisible: false });
                  router.refresh();
                },
              },
              {
                type: 'close',
                name: 'Close',
                action: () => setState({ ...state, isRemovePostCommentModalVisible: false }),
              },
            ]}
          >
            <div className='flex flex-col gap-1 p-5'>
              <p className='text-gray-500'>
                Are you sure you want to delete this post comment? This action cannot be undone.
              </p>
            </div>
          </Modal>,
          document.querySelector('body')!,
        )}
      <div className='relative'>
        <button
          {...props}
          onClick={() => setState({ ...state, isPostCommentOptionsDropdownVisible: true })}
        >
          {children}
        </button>
        {state.isPostCommentOptionsDropdownVisible && (
          <div
            ref={ref}
            className='absolute flex flex-col bg-white z-40 p-1 right-0 shadow-lg border rounded mt-2 text-gray-600'
          >
            <button
              type='button'
              className='w-full ps-2 pe-7 py-1 rounded hover:bg-slate-100 font-medium text-sm text-start inline-flex items-center'
            >
              <FlagIcon className='size-3 stroke-2 me-2' />
              Report
            </button>
            {authenticatedUser.userId === postComment.author?.id && (
              <>
                <button
                  type='button'
                  className='w-full ps-2 pe-7 py-1 rounded hover:bg-slate-100 font-medium text-sm text-start inline-flex items-center'
                >
                  <EditIcon className='size-3 stroke-2 me-2' />
                  Edit
                </button>
                <button
                  type='button'
                  className='w-full ps-2 pe-7 py-1 rounded hover:bg-slate-100 font-medium text-sm text-start inline-flex items-center'
                  onClick={() =>
                    setState({
                      ...state,
                      isPostCommentOptionsDropdownVisible: false,
                      isRemovePostCommentModalVisible: true,
                    })
                  }
                >
                  <RemoveIcon className='size-3 stroke-2 me-2' />
                  Remove
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PostCommentOptionsButton;
