'use client';

import { FC, FormEvent, FormHTMLAttributes, useEffect, useState } from 'react';
import useNotification from '../../hooks/notifications.hooks';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Post } from '../../store/types/post.types';
import { PostCategory } from '../../store/types/post-category.types';
import { PlusIcon, RemoveIcon } from '../Icons/Icons';
import { updatePost } from '../../actions/post.actions';
import { NotificationType } from '../../utils/notifications.utils';
import { ApplicationRoutes } from '../../utils/routes.utils';
import { resolveFilePath, resolveImage } from '../../utils/app.utils';

export interface EditPostFormProps extends FormHTMLAttributes<HTMLFormElement> {
  categories: PostCategory[];
  post: Post;
}

export interface EditPostFormState {
  data: Partial<Pick<Post, 'title' | 'content' | 'fundsToBeRaised' | 'isDraft'>> & {
    categories: PostCategory[];
    attachments: { file: File; name: string }[];
  };
  isImageRemoved: boolean;
  image: string | null;
  isLoaded: boolean;
  isSubmited: boolean;
  errors: any;
}

const initialState: EditPostFormState = {
  data: {
    isDraft: false,
    categories: [],
    attachments: [],
  },
  errors: {},
  isImageRemoved: false,
  isLoaded: false,
  isSubmited: false,
  image: null,
};

const EditPostForm: FC<EditPostFormProps> = ({ post, categories, ...props }) => {
  const [state, setState] = useState(initialState);
  const router = useRouter();
  const { createNotification } = useNotification();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const image = (event.target as HTMLFormElement).image.files[0];
    const formData = new FormData();

    formData.append('title', state.data.title || '');
    formData.append('content', state.data.content || '');
    formData.append('fundsToBeRaised', state.data.fundsToBeRaised?.toString() || '0');
    formData.append('isDraft', state.data.isDraft === true ? 'true' : 'false');
    state.data.attachments.forEach((attachment, index) => {
      formData.append(`attachments`, attachment.file);
      formData.append(`attachments[${index}][filename]`, attachment.name);
    });

    state.data.categories.forEach((category, index) => {
      formData.append(`categories[${index}][category]`, category.name);
    });

    const {
      data: { attachments, categories, ...data },
      ...stateWithoutAttachmentsAndCategories
    } = state as any;
    stateWithoutAttachmentsAndCategories.data = data;

    if (!state.image) {
      formData.set('image', '');
    } else if (image) {
      formData.set('image', image);
    }

    setState({ ...state, isSubmited: true });
    const response = await updatePost(stateWithoutAttachmentsAndCategories, post.id, formData);
    setState(response);

    if (response.errors.length > 0) {
      setState({ ...state, isSubmited: false });
    }

    if (response.errors.global) {
      setState({ ...state, isSubmited: false });
      createNotification({
        type: NotificationType.Error,
        message: response.errors.global,
      });
    }

    if (!response.errors.global && !response.errors.nested) {
      createNotification({
        type: NotificationType.Success,
        message: 'The post was successfully updated',
      });
      router.replace(ApplicationRoutes.Home);
    }
  };

  useEffect(() => {
    if (!state.isLoaded) {
      Promise.all(
        (post.attachments ?? []).map(attachment => {
          return fetch(
            resolveFilePath(attachment.file, attachment.resourceType as 'image' | 'video' | 'raw'),
          )
            .then(response => response.blob())
            .then(blob => {
              return {
                file: new File([blob], attachment.file),
                name: attachment.filename || attachment.file,
              };
            });
        }),
      ).then(attachments => {
        setState(prevState => ({
          ...prevState,
          image: post.image,
          data: {
            title: post.title,
            content: post.content,
            fundsToBeRaised: post.fundsToBeRaised,
            isDraft: post.isDraft,
            categories: (post.categories ?? []).map(category => ({ name: category.category })),
            attachments,
          },
        }));
      });

      setState(prevState => ({ ...prevState, isLoaded: true }));
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} {...props}>
      <div className='grid grid-cols-1 w-full gap-3 max-w-5xl'>
        <div className='flex flex-col'>
          <h3 className='my-3 font-bold text-xl text-gray-500 w-full'>Post image</h3>
          <div className='relative flex w-full rounded overflow-hidden aspect-video border'>
            <Image
              src={
                state.image === post.image
                  ? resolveImage(state.image, 'post-image-placeholder')
                  : state.image ||
                    process.env.NEXT_PUBLIC_PROFILE_IMAGE_PLACEHOLDER_SRC ||
                    '/post-image-placeholder.webp'
              }
              alt={`Post image`}
              sizes='100%, 100%'
              fill={true}
              className='object-cover'
              priority={true}
            />
          </div>
          <label
            htmlFor='edit-post-image'
            className='text-blue-600 font-medium cursor-pointer hover:text-blue-700 mt-2 transition-[0.3s_ease]'
          >
            Choose image
          </label>
          <span
            className='text-red-600 font-medium mb-1 cursor-pointer hover:text-red-700 transition-[0.3s_ease]'
            onClick={() => setState({ ...state, image: null })}
          >
            Remove image
          </span>
          <input
            type='file'
            name='image'
            id='edit-post-image'
            className={`border p-3 rounded-lg text-gray-700 font-medium hidden`}
            onChange={event =>
              setState({
                ...state,
                image: event.target.files?.[0]
                  ? URL.createObjectURL(event.target.files[0])
                  : post.image,
              })
            }
          />
        </div>
        <div className='flex flex-col relative gap-3'>
          <h3 className='my-3 font-bold text-xl text-gray-500 w-full'>General information</h3>
          <div className='flex flex-col'>
            <label htmlFor='edit-post-title' className='text-gray-500 font-medium text-sm mb-1'>
              Title:
            </label>
            <input
              type='text'
              name='title'
              id='edit-post-title'
              placeholder='Post title'
              defaultValue={state.data.title}
              className={`border p-3 rounded-lg text-gray-700 font-medium ${
                state.errors.nested?.title ? `border-red-500` : ``
              }`}
              onChange={event =>
                setState({
                  ...state,
                  data: {
                    ...state.data,
                    title: event.target.value,
                  },
                  errors: {
                    ...state.errors,
                    nested: Object.fromEntries(
                      Object.entries(state.errors.nested ?? {}).filter(
                        ([key, _]) => key !== 'title',
                      ),
                    ),
                  },
                })
              }
            />
            {state.errors.nested?.title?.map((error: string, index: number) => (
              <span key={index} className='text-red-500 text-xs font-medium mt-1 text-justify'>
                {error}
              </span>
            ))}
          </div>
          <div className='flex flex-col'>
            <label htmlFor='edit-post-content' className='text-gray-500 font-medium text-sm mb-1'>
              Content:
            </label>
            <textarea
              name='content'
              id='edit-post-content'
              placeholder='Share some interesting information with your followers or onlookers'
              defaultValue={state.data.content || undefined}
              className={`border p-3 rounded-lg text-gray-700 font-medium min-h-60 whitespace-pre-wrap ${
                state.errors.nested?.content ? `border-red-500` : ``
              }`}
              onChange={event =>
                setState({
                  ...state,
                  data: {
                    ...state.data,
                    content: event.target.value,
                  },
                  errors: {
                    ...state.errors,
                    nested: Object.fromEntries(
                      Object.entries(state.errors.nested ?? {}).filter(
                        ([key, _]) => key !== 'content',
                      ),
                    ),
                  },
                })
              }
            />
            {state.errors.nested?.content?.map((error: string, index: number) => (
              <span key={index} className='text-red-500 text-xs font-medium mt-1 text-justify'>
                {error}
              </span>
            ))}
          </div>
          <div className='flex flex-col'>
            <label
              htmlFor='edit-post-funds-to-be-raised'
              className='text-gray-500 font-medium text-sm mb-1'
            >
              Funds to be raised (in USD):
            </label>
            <input
              type='number'
              min={0.01}
              step={0.01}
              name='fundsToBeRaised'
              id='edit-post-funds-to-be-raised'
              placeholder='100'
              defaultValue={state.data.fundsToBeRaised}
              className={`border p-3 rounded-lg text-gray-700 font-medium ${
                state.errors.nested?.fundsToBeRaised ? `border-red-500` : ``
              }`}
              onChange={event =>
                setState({
                  ...state,
                  data: {
                    ...state.data,
                    fundsToBeRaised: event.target.value ? Number(event.target.value) : undefined,
                  },
                  errors: {
                    ...state.errors,
                    nested: Object.fromEntries(
                      Object.entries(state.errors.nested ?? {}).filter(
                        ([key, _]) => key !== 'fundsToBeRaised',
                      ),
                    ),
                  },
                })
              }
            />
            {state.errors.nested?.fundsToBeRaised?.map((error: string, index: number) => (
              <span key={index} className='text-red-500 text-xs font-medium mt-1 text-justify'>
                {error}
              </span>
            ))}
          </div>
          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                name='isDraft'
                id='edit-post-is-draft'
                className={`border p-3 rounded-lg text-gray-700 font-medium ${
                  state.errors.nested?.isDraft ? `border-red-500` : ``
                }`}
                defaultChecked={state.data.isDraft}
                onChange={event =>
                  setState({
                    ...state,
                    data: {
                      ...state.data,
                      isDraft: event.target.value ? Boolean(event.target.value) : false,
                    },
                    errors: {
                      ...state.errors,
                      nested: Object.fromEntries(
                        Object.entries(state.errors.nested ?? {}).filter(
                          ([key, _]) => key !== 'isDraft',
                        ),
                      ),
                    },
                  })
                }
              />
              <label
                htmlFor='edit-post-is-draft'
                className='text-gray-500 font-medium text cursor-pointer'
              >
                Is Draft
              </label>
            </div>
            {state.errors.nested?.isDraft?.map((error: string, index: number) => (
              <span key={index} className='text-red-500 text-xs font-medium mt-1 text-justify'>
                {error}
              </span>
            ))}
          </div>
          <div className='flex flex-col'>
            <h4
              className={`font-bold text-xl text-gray-500 mt-3 ${
                categories.filter(
                  category => !state.data.categories?.find(c => c.name === category.name),
                ).length > 0
                  ? 'mb-3'
                  : ''
              }`}
            >
              Categories
            </h4>
            <div className='flex gap-1 flex-wrap'>
              {categories
                .filter(category => !state.data.categories?.find(c => c.name === category.name))
                .map((category, index) => (
                  <span
                    key={index}
                    className='border rounded bg-slate-100 text-sm font-medium text-slate-600 px-2 py-0.5 cursor-pointer hover:bg-slate-200 transition-[0.3s_ease]'
                    onClick={() =>
                      setState({
                        ...state,
                        data: { ...state.data, categories: [...state.data.categories, category] },
                      })
                    }
                  >
                    {category.name}
                  </span>
                ))}
            </div>
            {(state.data.categories?.length ?? 0) === 0 ? (
              <div className='flex items-center justify-center rounded border-2 border-dashed p-2 my-3'>
                <h4 className='text-gray-500'>No categories have been added yet</h4>
              </div>
            ) : (
              <div className='flex rounded border-2 border-dashed p-2 my-3 flex-wrap gap-1'>
                {state.data.categories.map((category, index) => (
                  <span
                    key={index}
                    className='rounded bg-violet-500 text-sm font-medium text-white px-2 py-0.5 cursor-pointer hover:bg-violet-600 transition-[0.3s_ease]'
                    onClick={() =>
                      setState({
                        ...state,
                        data: {
                          ...state.data,
                          categories: state.data.categories?.filter(c => c.name !== category.name),
                        },
                      })
                    }
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className='flex flex-col'>
            <div className='flex justify-between items-center my-3'>
              <h4 className='font-bold text-xl text-gray-500'>Attachments</h4>
              <label
                htmlFor='edit-post-attachments'
                className='inline-flex bg-rose-600 text-sm px-2 py-1 rounded text-white font-medium justify-center items-center text-center self-start cursor-pointer hover:bg-rose-500 transition-[0.3s_ease]'
              >
                <PlusIcon className='size-4 stroke-2 me-1' />
                Attach files
              </label>
            </div>
            <input
              id='edit-post-attachments'
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
            {(state.data.attachments?.length ?? 0) > 0 ? (
              <div className='flex flex-col'>
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
            ) : (
              <div className='flex items-center justify-center rounded border-2 border-dashed p-2'>
                <h4 className='text-gray-500'>No attachments have been added yet</h4>
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        type='submit'
        disabled={!state.isLoaded || state.isSubmited}
        className='inline-flex mt-10 items-center justify-center text-center rounded bg-rose-600 text-white font-medium px-10 py-1.5 hover:bg-rose-500 transition-[0.3s_ease] disabled:bg-rose-300'
      >
        Save changes
      </button>
    </form>
  );
};

export default EditPostForm;
