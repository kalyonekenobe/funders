import { ChatsIcon, FeedsIcon, ProfileIcon, UsersIcon } from '@/app/(core)/ui/Icons/Icons';
import Navbar from '@/app/(core)/ui/Navbar/Navbar';
import Sidebar from '@/app/(core)/ui/Sidebar/Sidebar';
import { SidebarLink } from '@/app/(core)/ui/Sidebar/SidebarLink';
import { ApplicationRoutes } from '@/app/(core)/utils/routes.utils';
import { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const links: SidebarLink[] = [
  {
    content: (
      <>
        <FeedsIcon className='size-5 stroke-2 md:me-3' />
        <span className='hidden md:inline'>Feeds</span>
      </>
    ),
    url: ApplicationRoutes.Home,
  },
  {
    content: (
      <>
        <UsersIcon className='size-5 stroke-2 md:me-3' />
        <span className='hidden md:inline'>Users</span>
      </>
    ),
    url: ApplicationRoutes.Users,
  },
  // {
  //   content: (
  //     <>
  //       <ChatsIcon className='size-5 stroke-2 md:me-3' />
  //       <span className='hidden md:inline'>Chats</span>
  //     </>
  //   ),
  //   url: ApplicationRoutes.Chats,
  // },
  {
    content: (
      <>
        <ProfileIcon className='size-5 stroke-2 md:me-3' />
        <span className='hidden md:inline'>Profile</span>
      </>
    ),
    url: ApplicationRoutes.Profile,
  },
];

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <main className='flex flex-col min-h-screen'>
      <Navbar className='sticky top-0 w-full flex bg-white border-b border-gray-100 z-50' />
      <section className='flex flex-col flex-1 justify-start'>
        <div className='flex flex-col-reverse md:grid md:grid-cols-[4fr_8fr] lg:grid-cols-[3fr_9fr] xl:grid-cols-[2.5fr_9.5fr] 2xl:grid-cols-[2fr_10fr] auto-rows-fr self-stretch flex-1 w-full relative items-start'>
          <div className='w-full z-50 sticky flex flex-1 md:flex-col md:self-start bottom-0 md:bottom-auto md:top-[calc(4.5rem_+_1px)] md:h-full md:max-h-[calc(100vh_-_4.5rem_-_1px)]'>
            <Sidebar
              className='sticky top-0 w-full flex flex-1 bg-white z-50 border-t border-gray-100 md:border-t-0 md:border-r'
              links={links}
            />
          </div>
          <div className='flex flex-1 flex-col w-full h-full'>{children}</div>
        </div>
      </section>
    </main>
  );
};

export default Layout;
