import { FC } from 'react';
import { BanknotesIcon } from '../Icons/Icons';
import Link from 'next/link';
import { ApplicationRoutes } from '../../utils/routes.utils';
import Search from '../Search/Search';
import UserProfileLink from './UserProfileLink';

const Navbar: FC = () => {
  return (
    <div className='sticky top-0 w-full flex bg-white shadow'>
      <nav className='grid grid-cols-3 flex-1'>
        <div className='flex flex-1'>
          <Link href={ApplicationRoutes.Root} className='flex items-center px-5 py-4 text-rose-600'>
            <BanknotesIcon className='size-6 stroke-2 me-3' />
            <h2 className='font-semibold text-2xl font-["Open_Sans"]'>Funders</h2>
          </Link>
        </div>
        <div className='flex items-center w-full max-w-xl'>
          <Search />
        </div>
        <div className='flex flex-1 justify-end'>
          <UserProfileLink />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
