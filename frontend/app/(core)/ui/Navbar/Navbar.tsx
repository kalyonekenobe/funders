import { FC, HTMLAttributes } from 'react';
import Link from 'next/link';
import { ApplicationRoutes } from '../../utils/routes.utils';
import UserProfileLink from './UserProfileLink';
import { BanknotesIcon } from '@/app/(core)/ui/Icons/Icons';

export interface NavbarProps extends HTMLAttributes<HTMLDivElement> {}
export const revalidate = 0;

const Navbar: FC<NavbarProps> = ({ ...props }) => {
  return (
    <div {...props}>
      <nav className='grid grid-cols-[1fr_1fr] md:grid-cols-[4fr_5fr_3fr] lg:grid-cols-[3fr_6fr_3fr] xl:grid-cols-[2.5fr_7fr_2.5fr] 2xl:grid-cols-[2fr_8fr_2fr] flex-1'>
        <div className='flex flex-1'>
          <Link
            href={ApplicationRoutes.Home}
            className='flex items-center px-5 py-1.5 md:px-10 w-full text-rose-600 hover:bg-slate-50 transition-[0.3s_ease] relative justify-center'
          >
            <div className='flex relative h-[60px] min-w-[100px] justify-center items-center'>
              <BanknotesIcon className='size-6 stroke-2 me-3' />
              <h2 className='font-semibold text-2xl font-["Open_Sans"]'>Funders</h2>
            </div>
          </Link>
        </div>
        <div className='hidden md:flex items-center w-full px-5 justify-center'>
          {/* <Search className='flex flex-1 bg-slate-100 border rounded-full w-full max-w-2xl' /> */}
        </div>
        <div className='flex flex-1 justify-end'>
          <UserProfileLink />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
