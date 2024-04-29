'use client';

import Link from 'next/link';
import { FollowIcon, MessageIcon, UnfollowIcon } from '../Icons/Icons';
import { FC, HTMLAttributes, useState } from 'react';
import { Following } from '../../store/types/following.types';
import { AuthInfo } from '../../store/types/app.types';
import { User } from '../../store/types/user.types';
import ToggleFollowButton from '../Controls/ToggleFollowButton';
import UserListItem from './UserListItem';
import Modal from '../Modal/Modal';
import { createPortal } from 'react-dom';

export interface UserDetailsProfileFooterProps extends HTMLAttributes<HTMLDivElement> {
  user: User;
  authenticatedUser: AuthInfo;
}

export interface UserDetailsProfileFooterState {
  followers: Following[];
  followings: Following[];
  isFollowed: boolean;
  isFollowersListVisible: boolean;
  isFollowingsListVisible: boolean;
}

const initialState: UserDetailsProfileFooterState = {
  followers: [],
  followings: [],
  isFollowed: false,
  isFollowersListVisible: false,
  isFollowingsListVisible: false,
};

const UserDetailsProfileFooter: FC<UserDetailsProfileFooterProps> = ({
  user,
  authenticatedUser,
  ...props
}) => {
  const [state, setState] = useState({
    ...initialState,
    isFollowed: Boolean(
      user.followers?.find((follower: Following) => {
        return follower.followerId === authenticatedUser?.userId;
      }),
    ),
    followers: user.followers ?? [],
    followings: user.followings ?? [],
  });

  return (
    <>
      {state.isFollowersListVisible &&
        createPortal(
          <Modal
            className='max-w-xl'
            title={`${user.firstName} ${user.lastName}'s followers`}
            buttons={[
              {
                type: 'close',
                name: 'Close',
                action: () => setState({ ...state, isFollowersListVisible: false }),
              },
            ]}
          >
            <div className='flex flex-col gap-1 p-3'>
              {state.followers.map(follower => (
                <UserListItem
                  key={follower.followerId}
                  id={follower.followerId}
                  firstName={follower.follower?.firstName || ''}
                  lastName={follower.follower?.lastName || ''}
                  avatar={follower.follower?.avatar || null}
                  className='inline-flex items-center border rounded-lg p-1 hover:bg-slate-100 transition-[0.3s_ease]'
                />
              ))}
              {!state.followers.length && (
                <div className='min-h-[50px] flex items-center justify-center rounded-xl border-[3px] border-dashed'>
                  <h3 className='text-gray-400 font-semibold text-center'>
                    {user.firstName} {user.lastName} does not have any followers yet
                  </h3>
                </div>
              )}
            </div>
          </Modal>,
          document.querySelector('body')!,
        )}
      {state.isFollowingsListVisible &&
        createPortal(
          <Modal
            className='max-w-xl'
            title={`${user.firstName} ${user.lastName}'s followings`}
            buttons={[
              {
                type: 'close',
                name: 'Close',
                action: () => setState({ ...state, isFollowingsListVisible: false }),
              },
            ]}
          >
            <div className='flex flex-col gap-1 p-3'>
              {state.followings.map(following => (
                <UserListItem
                  key={following.userId}
                  id={following.userId}
                  firstName={following.user?.firstName || ''}
                  lastName={following.user?.lastName || ''}
                  avatar={following.user?.avatar || null}
                  className='inline-flex items-center border rounded-lg p-1 hover:bg-slate-100 transition-[0.3s_ease]'
                />
              ))}
              {!state.followings.length && (
                <div className='min-h-[50px] flex items-center justify-center rounded-xl border-[3px] border-dashed'>
                  <h3 className='text-gray-400 font-semibold text-center'>
                    {user.firstName} {user.lastName} does not follow any users
                  </h3>
                </div>
              )}
            </div>
          </Modal>,
          document.querySelector('body')!,
        )}
      <div {...props}>
        <div className='flex w-full gap-3'>
          <span
            className='text-gray-500 cursor-pointer hover:text-gray-700 transition-[0.3s_ease]'
            onClick={() => setState({ ...state, isFollowersListVisible: true })}
          >
            {state.followers.length} followers
          </span>
          <span
            className='text-gray-500 cursor-pointer hover:text-gray-700 transition-[0.3s_ease]'
            onClick={() => setState({ ...state, isFollowingsListVisible: true })}
          >
            {state.followings.length} followings
          </span>
        </div>
        <div className='grid grid-cols-2 gap-3 mt-3'>
          <ToggleFollowButton
            followClassName='inline-flex p-1 text-center justify-center items-center rounded bg-blue-500 text-white font-medium text-sm hover:ring-2 hover:ring-blue-500 hover:ring-inset hover:text-blue-500 hover:bg-transparent transition-[0.3s_ease]'
            userId={user.id}
            unfollowClassName='inline-flex p-1 text-center justify-center items-center rounded bg-rose-500 text-white font-medium text-sm hover:ring-2 hover:ring-rose-500 hover:ring-inset hover:text-rose-500 hover:bg-transparent transition-[0.3s_ease]'
            followContent={
              <>
                <FollowIcon className='size-4 stroke-2 me-1.5' />
                Follow
              </>
            }
            unfollowContent={
              <>
                <UnfollowIcon className='size-4 stroke-2 me-1.5' />
                Unfollow
              </>
            }
            isFollowed={Boolean(
              state.followers.find(
                (follower: Following) => follower.followerId === authenticatedUser?.userId,
              ),
            )}
            updateFollowers={follower =>
              setState({
                ...state,
                followers: follower
                  ? [
                      ...state.followers,
                      {
                        followerId: authenticatedUser.userId,
                        userId: user.id,
                        follower: {
                          ...authenticatedUser,
                          id: authenticatedUser.userId,
                        } as any,
                      },
                    ]
                  : state.followers.filter(
                      follower => follower.followerId !== authenticatedUser.userId,
                    ),
              })
            }
          />
          <Link
            href={''}
            className='inline-flex bg-slate-100 ring-[1px] ring-inset ring-gray-300 text-slate-600 rounded px-10 py-1.5 text-center justify-center items-center font-medium text-sm hover:bg-slate-200 hover:text-slate-700 transition-[0.3s_ease]'
          >
            <MessageIcon className='size-4 stroke-2 me-1.5' />
            Message
          </Link>
        </div>
      </div>
    </>
  );
};

export default UserDetailsProfileFooter;
