'use client';

import { ButtonHTMLAttributes, FC, ReactNode, SyntheticEvent, useState } from 'react';
import { followUser, unfollowUser } from '../../actions/user.actions';
import useNotification from '../../hooks/notifications.hooks';
import { NotificationType } from '../../utils/notifications.utils';

export interface ToggleFollowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  userId: string;
  followClassName: string;
  unfollowClassName: string;
  followContent: ReactNode;
  unfollowContent: ReactNode;
  isFollowed: boolean;
  updateFollowers?: (follower: boolean) => void;
}

const ToggleFollowButton: FC<ToggleFollowButtonProps> = ({
  children,
  userId,
  followClassName,
  followContent,
  unfollowClassName,
  unfollowContent,
  isFollowed,
  updateFollowers,
  ...props
}) => {
  const [isActive, setIsActive] = useState(!isFollowed);
  const { createNotification } = useNotification();

  const handleClick = async (event: SyntheticEvent) => {
    const response = isActive ? await followUser(userId) : await unfollowUser(userId);

    if (!response.error) {
      updateFollowers?.(isActive);
      setIsActive(!isActive);
    } else {
      createNotification({
        type: NotificationType.Error,
        message: response.error || 'Cannot follow this user',
      });
    }
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      className={isActive ? followClassName : unfollowClassName}
      {...props}
    >
      {isActive ? followContent : unfollowContent}
      {children}
    </button>
  );
};

export default ToggleFollowButton;
