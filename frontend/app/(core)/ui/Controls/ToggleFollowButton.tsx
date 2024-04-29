'use client';

import { ButtonHTMLAttributes, FC, ReactNode, SyntheticEvent, useState } from 'react';
import { followUser, unfollowUser } from '../../actions/user.actions';

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

  const handleClick = async (event: SyntheticEvent) => {
    const response = isActive ? await followUser(userId) : await unfollowUser(userId);

    if (response) {
      updateFollowers?.(isActive);
      setIsActive(!isActive);
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
