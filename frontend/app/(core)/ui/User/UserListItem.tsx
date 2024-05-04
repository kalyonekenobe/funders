import Image from 'next/image';
import Link from 'next/link';
import { FC, HTMLAttributes } from 'react';
import { ApplicationRoutes } from '../../utils/routes.utils';
import { resolveImage } from '../../utils/app.utils';

export interface UserListItemProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

const UserListItem: FC<UserListItemProps> = ({
  id,
  firstName,
  lastName,
  avatar,
  className,
  ...props
}) => {
  return (
    <Link href={ApplicationRoutes.UserDetails.replace(':id', id)} className={`flex ${className}`}>
      <div className='relative flex flex-1 overflow-hidden rounded max-w-[32px] aspect-square'>
        <Image
          src={resolveImage(avatar, 'default-profile-image')}
          alt={`${firstName} ${lastName}'s profile image`}
          sizes='100%, 100%'
          fill={true}
          priority={true}
          className='object-cover'
        />
      </div>
      <div className='ms-3'>
        <span className='font-medium text-gray-600 text-sm'>
          {firstName} {lastName}
        </span>
      </div>
    </Link>
  );
};

export default UserListItem;
