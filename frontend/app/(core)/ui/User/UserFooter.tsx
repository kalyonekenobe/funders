'use client';

import { FC, HTMLAttributes, useState } from 'react';
import { User } from '../../store/types/user.types';
import { FollowIcon, UnfollowIcon, ViewProfileIcon } from '../Icons/Icons';
import { Following } from '../../store/types/following.types';
import ToggleFollowButton from '../Controls/ToggleFollowButton';
import { ApplicationRoutes } from '../../utils/routes.utils';
import { AuthInfo } from '../../store/types/app.types';
import { createPortal } from 'react-dom';
import Modal from '../Modal/Modal';
import UserListItem from './UserListItem';

export interface UserCardFooterProps extends HTMLAttributes<HTMLDivElement> {
  user: User;
  authenticatedUser: AuthInfo;
}

export interface UserCardFooterState {
  followers: Following[];
  followings: Following[];
  isFollowed: boolean;
  isFollowersListVisible: boolean;
  isFollowingsListVisible: boolean;
}

const initialState: UserCardFooterState = {
  followers: [],
  followings: [],
  isFollowed: false,
  isFollowersListVisible: false,
  isFollowingsListVisible: false,
};

const UserFooter: FC<UserCardFooterProps> = ({ user, authenticatedUser, ...props }) => {
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
                  className='inline-flex items-center rounded p-1 hover:bg-slate-100 transition-[0.3s_ease]'
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
                  className='inline-flex items-center rounded p-1 hover:bg-slate-100 transition-[0.3s_ease]'
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
      <footer {...props}>
        <div className='flex gap-2 my-3 justify-center'>
          <span
            className='text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-[0.3s_ease]'
            onClick={() => setState({ ...state, isFollowersListVisible: true })}
          >
            {state.followers.length} followers
          </span>
          <span
            className='text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-[0.3s_ease]'
            onClick={() => setState({ ...state, isFollowingsListVisible: true })}
          >
            {state.followings.length} followings
          </span>
        </div>
        <a
          href={ApplicationRoutes.UserDetails.replace(':id', user.id)}
          className='inline-flex items-center ring-[1px] ring-inset ring-gray-300 p-1 text-center justify-center rounded bg-slate-100 text-slate-600 font-medium text-sm  hover:bg-slate-200 hover:text-slate-700 transition-[0.3s_ease]'
        >
          <ViewProfileIcon className='size-4 stroke-2 me-1.5' />
          View profile
        </a>
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
          isFollowed={state.isFollowed}
          updateFollowers={follower =>
            setState({
              ...state,
              followers: follower
                ? [
                    {
                      followerId: authenticatedUser.userId,
                      userId: user.id,
                      follower: {
                        ...authenticatedUser,
                        id: authenticatedUser.userId,
                      } as any,
                    },
                    ...state.followers,
                  ]
                : state.followers.filter(
                    follower => follower.followerId !== authenticatedUser.userId,
                  ),
            })
          }
        />
      </footer>
    </>
  );
};

export default UserFooter;
