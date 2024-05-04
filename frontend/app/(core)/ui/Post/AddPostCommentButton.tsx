'use client';

import { ButtonHTMLAttributes, FC, FormEvent, useRef, useState } from 'react';
import { Post } from '../../store/types/post.types';
import { createPortal } from 'react-dom';
import Modal from '../Modal/Modal';
import { PlusIcon, RemoveIcon } from '../Icons/Icons';
import { NotificationType } from '../../utils/notifications.utils';
import useNotification from '../../hooks/notifications.hooks';
import { PostComment } from '../../store/types/post-comment.types';
import { addPostComment } from '../../actions/post.actions';
import { ApplicationRoutes } from '../../utils/routes.utils';
import Link from 'next/link';

export interface AddPostCommentButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  post: Post;
  replyTo: PostComment | null;
  onAddComment?: (comment: PostComment) => void;
}

export interface AddPostCommentButtonState {
  isAddPostCommentModalVisible: boolean;
  data: {
    comment: string;
    attachments: { file: File; name: string }[];
  };
  isLoading: boolean;
  errors: any;
}

const initialState: AddPostCommentButtonState = {
  isAddPostCommentModalVisible: false,
  data: {
    comment: '',
    attachments: [],
  },
  isLoading: false,
  errors: {},
};

const AddPostCommentButton: FC<AddPostCommentButtonProps> = ({
  post,
  children,
  replyTo,
  onAddComment,
  ...props
}) => {
  const [state, setState] = useState(initialState);
  const commentFormRef = useRef<HTMLFormElement>(null);
  const { createNotification } = useNotification();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.set('comment', state.data.comment);

    if (replyTo) {
      formData.set('parentCommentId', replyTo.id);
    }

    state.data.attachments.forEach((attachment, index) => {
      formData.append(`attachments`, attachment.file);
      formData.append(`attachments[${index}][filename]`, attachment.name);
    });
    const {
      data: { attachments, ...data },
      ...stateWithoutAttachments
    } = state as any;
    stateWithoutAttachments.data = data;

    const response = await addPostComment(stateWithoutAttachments, post.id, formData);
    setState(() => ({ ...response, data: { ...response.data, attachments } }));

    if (!response.errors.global && !response.errors.nested) {
      createNotification({
        type: NotificationType.Success,
        message: 'The post comment was successfully created',
      });

      setState(prevState => ({
        ...prevState,
        data: { comment: '', attachments: [] },
        isAddPostCommentModalVisible: false,
      }));

      onAddComment?.(response.createdComment);
    }

    if (response.errors.global) {
      createNotification({
        type: NotificationType.Error,
        message: response.errors.global || 'Cannot create post comment. Please, try again later',
      });
    }

    setState(prevState => ({ ...prevState, isLoading: false }));
  };

  return (
    <>
      {state.isAddPostCommentModalVisible &&
        createPortal(
          <Modal
            className='max-w-3xl'
            title={'Add a comment'}
            buttons={[
              {
                type: 'close',
                name: 'Close',
                action: () => setState({ ...state, isAddPostCommentModalVisible: false }),
              },
              {
                type: 'accept',
                name: 'Add',
                disabled: state.isLoading,
                action: () => {
                  setState(prevState => ({ ...prevState, isLoading: true }));
                  if (commentFormRef.current) {
                    commentFormRef.current.dispatchEvent(
                      new Event('submit', { cancelable: true, bubbles: true }),
                    );
                  } else {
                    createNotification({
                      type: NotificationType.Error,
                      message: 'Cannot submit the form. Please, try again later',
                    });
                    setState(prevState => ({ ...prevState, isLoading: false }));
                  }
                },
              },
            ]}
          >
            <form onSubmit={handleSubmit} ref={commentFormRef} className='p-5'>
              {replyTo !== null && (
                <h3 className='inline-flex items-center gap-1 font-medium mb-3 text-gray-500'>
                  Reply to
                  <Link
                    href={ApplicationRoutes.UserDetails.replace(':id', replyTo.author!.id)}
                    className='text-blue-600 hover:text-blue-700 transition-[0.3s_ease]'
                  >
                    {replyTo.author!.firstName} {replyTo.author!.lastName}
                  </Link>
                </h3>
              )}
              <div className='flex flex-col'>
                <label
                  htmlFor='add-comment-text'
                  className='text-gray-600 text-sm mb-0.5 font-medium'
                >
                  Comment
                </label>
                <textarea
                  className={`border rounded p-2 resize-y min-h-32 text-gray-700 font-medium whitespace-pre-wrap ${
                    state.errors.nested?.comment ? 'border-red-500' : ''
                  }`}
                  defaultValue={state.data.comment}
                  onChange={event =>
                    setState({
                      ...state,
                      data: { ...state.data, comment: event.target.value },
                      errors: Object.fromEntries(
                        Object.entries(state.errors.nested || {}).filter(
                          ([key, _]) => key !== 'comment',
                        ),
                      ),
                    })
                  }
                />
                {state.errors.nested?.comment?.map((error: string, index: number) => (
                  <span className='text-red-500 text-sm my-1 font-medium' key={index}>
                    {error}
                  </span>
                ))}
                <label
                  htmlFor='add-comment-attachments'
                  className='inline-flex bg-rose-600 text-xs mt-3 px-2 py-1 rounded text-white font-bold justify-center items-center text-center self-start cursor-pointer hover:bg-rose-500 transition-[0.3s_ease]'
                >
                  <PlusIcon className='size-3 stroke-[3px] me-1' />
                  Attach files
                </label>
                <input
                  id='add-comment-attachments'
                  className='hidden'
                  type='file'
                  multiple
                  onChange={event =>
                    setState({
                      ...state,
                      data: {
                        ...state.data,
                        attachments: [
                          ...state.data.attachments,
                          ...Array.from(event.target.files || []).map(file => ({
                            file,
                            name: file.name,
                          })),
                        ],
                      },
                    })
                  }
                />
                {state.data.attachments.length > 0 && (
                  <div className='flex flex-col mt-2'>
                    {state.data.attachments.map((attachment, index) => (
                      <div key={index} className='flex flex-col w-full mb-1'>
                        <div className='flex w-full text-gray items-center gap-1'>
                          <input
                            className={`rounded border px-2 py-1 w-full text-sm text-gray-700 font-medium ${
                              state.errors.nested?.attachments?.[index]?.length > 0
                                ? 'border-red-500'
                                : ''
                            }`}
                            value={attachment.name}
                            onChange={event =>
                              setState({
                                ...state,
                                data: {
                                  ...state.data,
                                  attachments: state.data.attachments.map(a =>
                                    attachment === a ? { ...a, name: event.target.value } : a,
                                  ),
                                },
                                errors: {
                                  ...state.errors,
                                  nested: {
                                    ...state.errors.nested,
                                    attachments: Object.fromEntries(
                                      Object.entries(state.errors.nested?.attachments || {}).filter(
                                        ([key, _]) => key !== index.toString(),
                                      ),
                                    ),
                                  },
                                },
                              })
                            }
                          />
                          <button
                            type='button'
                            className='relative border rounded inline-flex w-[2em] aspect-square justify-center items-center text-red-500'
                            onClick={() =>
                              setState({
                                ...state,
                                data: {
                                  ...state.data,
                                  attachments: state.data.attachments.filter(a => a !== attachment),
                                },
                                errors: {
                                  ...state.errors,
                                  nested: {
                                    ...state.errors.nested,
                                    attachments: Object.fromEntries(
                                      Object.entries(state.errors.nested?.attachments || {}).filter(
                                        ([key, _]) => key !== index.toString(),
                                      ),
                                    ),
                                  },
                                },
                              })
                            }
                          >
                            <RemoveIcon className='size-4 stroke-2' />
                          </button>
                        </div>
                        {state.errors.nested?.attachments?.[index]?.map(
                          (error: string, index: number) => (
                            <span key={index} className='text-red-500 text-xs mt-1 font-medium'>
                              {error}
                            </span>
                          ),
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </Modal>,
          document.querySelector('body')!,
        )}
      <button
        type='button'
        {...props}
        onClick={() => setState({ ...state, isAddPostCommentModalVisible: true })}
      >
        {children}
      </button>
    </>
  );
};

export default AddPostCommentButton;
