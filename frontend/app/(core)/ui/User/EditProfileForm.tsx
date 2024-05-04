'use client';

import { FC, FormEvent, FormHTMLAttributes, useEffect, useState } from 'react';
import { User } from '../../store/types/user.types';
import { udpateUser } from '../../actions/user.actions';
import useNotification from '../../hooks/notifications.hooks';
import { NotificationType } from '../../utils/notifications.utils';
import { ApplicationRoutes } from '../../utils/routes.utils';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { resolveImage } from '../../utils/app.utils';
import PasswordInput from '../Controls/PasswordInput';

export interface EditProfileFormProps extends FormHTMLAttributes<HTMLFormElement> {
  user: User;
}

export interface EditProfileFormState {
  data: Partial<
    Pick<User, 'firstName' | 'lastName' | 'phone' | 'bio' | 'birthDate'> & {
      password?: string;
      confirmPassword?: string;
    }
  >;
  isAvatarRemoved: boolean;
  avatar: string | null;
  isLoaded: boolean;
  isSubmited: boolean;
  errors: any;
}

const initialState: EditProfileFormState = {
  data: {},
  errors: {},
  isAvatarRemoved: false,
  isLoaded: false,
  isSubmited: false,
  avatar: null,
};

const EditProfileForm: FC<EditProfileFormProps> = ({ user, ...props }) => {
  const [state, setState] = useState({
    ...initialState,
    data: {
      ...initialState.data,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      bio: user.bio,
      birthDate: user.birthDate,
      password: undefined,
      confirmPassword: undefined,
    } as EditProfileFormState['data'],
    avatar: user.avatar,
  });
  const router = useRouter();
  const { createNotification } = useNotification();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const avatar = (event.target as HTMLFormElement).avatar.files[0];
    const formData = new FormData();

    formData.set('id', user.id);
    Object.entries(state.data).forEach(([key, value]) => {
      if (key === 'birthDate') {
        formData.set(key, value ? new Date(value).toISOString().slice(0, 10) : '');
      } else if (value !== undefined) {
        formData.set(key, value?.toString() || '');
      }
    });

    if (!state.avatar) {
      formData.set('avatar', '');
    } else if (avatar) {
      formData.set('avatar', avatar);
    }

    await submit(formData);
  };

  const submit = async (formData: FormData) => {
    setState({ ...state, isSubmited: true });
    const response = await udpateUser(state, formData);
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
        message: 'The user profile was successfully updated',
      });
      router.replace(ApplicationRoutes.Profile);
    }
  };

  useEffect(() => {
    if (!state.isLoaded) {
      setState({ ...state, isLoaded: true });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} {...props}>
      <div className='grid grid-cols-1 lg:grid-cols-[256px_1fr] w-full gap-3'>
        <div className='flex flex-col pr-5 pb-5'>
          <h3 className='my-3 font-bold text-xl text-gray-500'>Profile image</h3>
          <div className='relative flex w-full max-w-[256px] rounded overflow-hidden aspect-square border'>
            <Image
              src={
                state.avatar === user.avatar
                  ? resolveImage(state.avatar, 'profile-image-placeholder')
                  : state.avatar ||
                    process.env.NEXT_PUBLIC_PROFILE_IMAGE_PLACEHOLDER_SRC ||
                    '/profile-image-placeholder.webp'
              }
              alt={`${user.firstName} ${user.lastName}'s profile image`}
              sizes='100%, 100%'
              fill={true}
              className='object-cover'
              priority={true}
            />
          </div>
          <label
            htmlFor='profile-avatar'
            className='text-blue-600 font-medium text-sm cursor-pointer hover:text-blue-700 mt-2 transition-[0.3s_ease]'
          >
            Choose avatar
          </label>
          <span
            className='text-red-600 font-medium text-sm mb-1 cursor-pointer hover:text-red-700 transition-[0.3s_ease]'
            onClick={() => setState({ ...state, avatar: null })}
          >
            Remove avatar
          </span>
          <input
            type='file'
            name='avatar'
            id='profile-avatar'
            className={`border p-3 rounded-lg text-gray-700 font-medium hidden`}
            onChange={event =>
              setState({
                ...state,
                avatar: event.target.files?.[0]
                  ? URL.createObjectURL(event.target.files[0])
                  : user.avatar,
              })
            }
          />
        </div>
        <div className='flex flex-col relative sm:grid sm:grid-cols-2 gap-3'>
          <h3 className='col-span-1 sm:col-span-2 my-3 font-bold text-xl text-gray-500 w-full'>
            General information
          </h3>
          <div className='flex flex-col'>
            <label htmlFor='profile-first-name' className='text-gray-500 font-medium text-sm mb-1'>
              First name:
            </label>
            <input
              type='text'
              name='firstName'
              id='profile-first-name'
              placeholder='John'
              defaultValue={state.data.firstName}
              className={`border p-3 rounded-lg text-gray-700 font-medium ${
                state.errors.nested?.firstName ? `border-red-500` : ``
              }`}
              onChange={event =>
                setState({
                  ...state,
                  data: {
                    ...state.data,
                    firstName: event.target.value,
                  },
                  errors: {
                    ...state.errors,
                    nested: Object.fromEntries(
                      Object.entries(state.errors.nested ?? {}).filter(
                        ([key, _]) => key !== 'firstName',
                      ),
                    ),
                  },
                })
              }
            />
            {state.errors.nested?.firstName?.map((error: string, index: number) => (
              <span key={index} className='text-red-500 text-xs font-medium mt-1 text-justify'>
                {error}
              </span>
            ))}
          </div>
          <div className='flex flex-col'>
            <label htmlFor='profile-last-name' className='text-gray-500 font-medium text-sm mb-1'>
              Last name:
            </label>
            <input
              type='text'
              name='lastName'
              id='profile-last-name'
              placeholder='Doe'
              defaultValue={state.data.lastName}
              className={`border p-3 rounded-lg text-gray-700 font-medium ${
                state.errors.nested?.lastName ? `border-red-500` : ``
              }`}
              onChange={event =>
                setState({
                  ...state,
                  data: {
                    ...state.data,
                    lastName: event.target.value,
                  },
                  errors: {
                    ...state.errors,
                    nested: Object.fromEntries(
                      Object.entries(state.errors.nested ?? {}).filter(
                        ([key, _]) => key !== 'lastName',
                      ),
                    ),
                  },
                })
              }
            />
            {state.errors.nested?.lastName?.map((error: string, index: number) => (
              <span key={index} className='text-red-500 text-xs font-medium mt-1 text-justify'>
                {error}
              </span>
            ))}
          </div>
          <div className='flex flex-col'>
            <label htmlFor='profile-phone' className='text-gray-500 font-medium text-sm mb-1'>
              Phone:
            </label>
            <input
              type='tel'
              name='phone'
              id='profile-phone'
              placeholder='+380987654321'
              defaultValue={state.data.phone || undefined}
              className={`border p-3 rounded-lg text-gray-700 font-medium ${
                state.errors.nested?.phone ? `border-red-500` : ``
              }`}
              onChange={event =>
                setState({
                  ...state,
                  data: {
                    ...state.data,
                    phone: event.target.value,
                  },
                  errors: {
                    ...state.errors,
                    nested: Object.fromEntries(
                      Object.entries(state.errors.nested ?? {}).filter(
                        ([key, _]) => key !== 'phone',
                      ),
                    ),
                  },
                })
              }
            />
            {state.errors.nested?.phone?.map((error: string, index: number) => (
              <span key={index} className='text-red-500 text-xs font-medium mt-1 text-justify'>
                {error}
              </span>
            ))}
          </div>
          <div className='flex flex-col'>
            <label htmlFor='profile-birth-date' className='text-gray-500 font-medium text-sm mb-1'>
              Birth date:
            </label>
            <input
              type='date'
              name='birthDate'
              id='profile-birth-date'
              defaultValue={
                state.data.birthDate
                  ? new Date(state.data.birthDate).toISOString().slice(0, 10)
                  : undefined
              }
              className={`border p-3 rounded-lg text-gray-700 font-medium ${
                state.errors.nested?.birthDate ? `border-red-500` : ``
              }`}
              onChange={event =>
                setState({
                  ...state,
                  data: {
                    ...state.data,
                    birthDate: event.target.value ? new Date(event.target.value) : undefined,
                  },
                  errors: {
                    ...state.errors,
                    nested: Object.fromEntries(
                      Object.entries(state.errors.nested ?? {}).filter(
                        ([key, _]) => key !== 'birthDate',
                      ),
                    ),
                  },
                })
              }
            />
            {state.errors.nested?.birthDate?.map((error: string, index: number) => (
              <span key={index} className='text-red-500 text-xs font-medium mt-1 text-justify'>
                {error}
              </span>
            ))}
          </div>
          <div className='flex flex-col col-span-2'>
            <label htmlFor='profile-bio' className='text-gray-500 font-medium text-sm mb-1'>
              Bio:
            </label>
            <textarea
              name='bio'
              id='profile-bio'
              placeholder='Share some interesting information about you'
              defaultValue={state.data.bio || undefined}
              className={`border p-3 rounded-lg text-gray-700 font-medium min-h-60 whitespace-pre-wrap ${
                state.errors.nested?.bio ? `border-red-500` : ``
              }`}
              onChange={event =>
                setState({
                  ...state,
                  data: {
                    ...state.data,
                    bio: event.target.value,
                  },
                  errors: {
                    ...state.errors,
                    nested: Object.fromEntries(
                      Object.entries(state.errors.nested ?? {}).filter(([key, _]) => key !== 'bio'),
                    ),
                  },
                })
              }
            />
            {state.errors.nested?.bio?.map((error: string, index: number) => (
              <span key={index} className='text-red-500 text-xs font-medium mt-1 text-justify'>
                {error}
              </span>
            ))}
          </div>
          <h3 className='col-span-1 sm:col-span-2 my-3 font-bold text-xl text-gray-500 w-full'>
            Change password
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 w-full gap-3 col-span-2'>
            <div className='flex flex-col'>
              <label htmlFor='profile-password' className='text-gray-500 font-medium text-sm mb-1'>
                New password:
              </label>
              <PasswordInput
                name='password'
                id='profile-password'
                placeholder='Password'
                defaultValue={state.data.password || undefined}
                className={`border p-3 rounded-lg text-gray-700 font-medium w-full ${
                  state.errors.nested?.password ? `border-red-500` : ``
                }`}
                onChange={event =>
                  setState({
                    ...state,
                    data: {
                      ...state.data,
                      password: event.target.value,
                    },
                    errors: {
                      ...state.errors,
                      nested: Object.fromEntries(
                        Object.entries(state.errors.nested ?? {}).filter(
                          ([key, _]) => key !== 'password' && key !== 'confirmPassword',
                        ),
                      ),
                    },
                  })
                }
              />
              {state.errors.nested?.password?.map((error: string, index: number) => (
                <span key={index} className='text-red-500 text-xs font-medium mt-1 text-justify'>
                  {error}
                </span>
              ))}
            </div>
            <div className='flex flex-col'>
              <label
                htmlFor='profile-confirm-password'
                className='text-gray-500 font-medium text-sm mb-1'
              >
                New password:
              </label>
              <PasswordInput
                name='confirmPassword'
                id='profile-confirm-password'
                placeholder='Confirm password'
                defaultValue={state.data.confirmPassword || undefined}
                className={`border p-3 rounded-lg text-gray-700 font-medium w-full ${
                  state.errors.nested?.confirmPassword ? `border-red-500` : ``
                }`}
                onChange={event =>
                  setState({
                    ...state,
                    data: {
                      ...state.data,
                      confirmPassword: event.target.value,
                    },
                    errors: {
                      ...state.errors,
                      nested: Object.fromEntries(
                        Object.entries(state.errors.nested ?? {}).filter(
                          ([key, _]) => key !== 'confirmPassword' && key !== 'password',
                        ),
                      ),
                    },
                  })
                }
              />
              {state.errors.nested?.confirmPassword?.map((error: string, index: number) => (
                <span key={index} className='text-red-500 text-xs font-medium mt-1 text-justify'>
                  {error}
                </span>
              ))}
            </div>
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

export default EditProfileForm;
