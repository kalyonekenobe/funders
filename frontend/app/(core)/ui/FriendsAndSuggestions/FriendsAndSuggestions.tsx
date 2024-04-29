import { FC, HTMLAttributes } from 'react';
import { getUserFriendsAndSuggestions } from '../../actions/user.actions';
import { getAuthInfo } from '../../actions/auth.actions';
import { User } from '../../store/types/user.types';
import Link from 'next/link';
import Image from 'next/image';
import { ApplicationRoutes } from '../../utils/routes.utils';

export interface FriendsAndSuggestionsProps extends HTMLAttributes<HTMLDivElement> {}

const fetchData = async () => {
  const authenticatedUser = await getAuthInfo();

  const friendsAndSuggestions = authenticatedUser
    ? await getUserFriendsAndSuggestions(authenticatedUser.userId, 5)
    : { friends: [], suggestions: [] };

  return { authenticatedUser, friendsAndSuggestions };
};

const FriendsAndSuggestions: FC<FriendsAndSuggestionsProps> = async ({ ...props }) => {
  const { friendsAndSuggestions } = await fetchData();

  return (
    <aside {...props}>
      <div className='flex flex-col px-5'>
        <h3 className='font-bold text-xl text-gray-500 my-5'>Friends</h3>
        <div className='flex flex-col gap-2'>
          {friendsAndSuggestions.friends.map((friend: User) => (
            <Link
              key={friend.id}
              href={ApplicationRoutes.UserDetails.replace(':id', friend.id)}
              className='border rounded-xl p-2 flex items-center border-slate-100 hover:bg-slate-100 transition-[0.3s_ease]'
            >
              <div className='flex flex-1 max-w-[35px] me-2 w-full h-full aspect-square overflow-hidden rounded relative'>
                <Image
                  src={
                    friend.avatar ||
                    process.env.NEXT_PUBLIC_DEFAULT_PROFILE_IMAGE_SRC ||
                    '/default-profile-image.webp'
                  }
                  alt={`${friend.firstName} ${friend.lastName}'s profile image`}
                  sizes='64px, 64px'
                  fill={true}
                />
              </div>
              <div className='flex flex-col'>
                <p className='font-semibold text-gray-500 text-sm'>
                  {friend.firstName} {friend.lastName}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href={ApplicationRoutes.Profile}
          className='text-xs font-medium text-blue-500 hover:text-blue-700 transition-[0.3s_ease] mt-3'
        >
          View all friends -&gt;
        </Link>
        <h3 className='font-bold text-xl text-gray-500 my-5'>Suggestions</h3>
        <div className='flex flex-col gap-2'>
          {friendsAndSuggestions.suggestions.map((suggestion: User) => (
            <Link
              key={suggestion.id}
              href={ApplicationRoutes.UserDetails.replace(':id', suggestion.id)}
              className='border rounded-xl p-2 flex items-center border-slate-100 hover:bg-slate-100 transition-[0.3s_ease]'
            >
              <div className='flex flex-1 max-w-[35px] me-2 w-full h-full aspect-square overflow-hidden rounded relative'>
                <Image
                  src={
                    suggestion.avatar ||
                    process.env.NEXT_PUBLIC_DEFAULT_PROFILE_IMAGE_SRC ||
                    '/default-profile-image.webp'
                  }
                  alt={`${suggestion.firstName} ${suggestion.lastName}'s profile image`}
                  sizes='64px, 64px'
                  fill={true}
                />
              </div>
              <div className='flex flex-col'>
                <p className='font-semibold text-gray-500 text-sm'>
                  {suggestion.firstName} {suggestion.lastName}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href={ApplicationRoutes.Users}
          className='text-xs font-medium text-blue-500 hover:text-blue-700 transition-[0.3s_ease] mt-3'
        >
          View more suggestions -&gt;
        </Link>
      </div>
    </aside>
  );
};

export default FriendsAndSuggestions;
