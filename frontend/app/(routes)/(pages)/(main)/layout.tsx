import { ChatsIcon, FeedsIcon, ProfileIcon, UsersIcon } from '@/app/(core)/ui/Icons/Icons';
import Navbar from '@/app/(core)/ui/Navbar/Navbar';
import Sidebar, { SidebarLink } from '@/app/(core)/ui/Sidebar/Sidebar';
import { ApplicationRoutes } from '@/app/(core)/utils/routes.utils';
import { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const links: SidebarLink[] = [
  {
    content: (
      <>
        <FeedsIcon className='size-6 stroke-2 md:me-3' />
        <span className='hidden md:inline'>Feeds</span>
      </>
    ),
    url: ApplicationRoutes.Home,
    isActiveRegex: /(.*)/i,
  },
  {
    content: (
      <>
        <UsersIcon className='size-6 stroke-2 md:me-3' />
        <span className='hidden md:inline'>Users</span>
      </>
    ),
    url: ApplicationRoutes.Users,
    isActiveRegex: /\/users(\/(\d|(a-z)){36, 36})?/i,
  },
  {
    content: (
      <>
        <ChatsIcon className='size-6 stroke-2 md:me-3' />
        <span className='hidden md:inline'>Chats</span>
      </>
    ),
    url: ApplicationRoutes.Chats,
    isActiveRegex: /\/chats(\/(\d|(a-z)){36, 36})?/i,
  },
  {
    content: (
      <>
        <ProfileIcon className='size-6 stroke-2 md:me-3' />
        <span className='hidden md:inline'>Profile</span>
      </>
    ),
    url: ApplicationRoutes.Profile,
    isActiveRegex: /\/profile/i,
  },
];

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <main className='flex flex-col min-h-screen'>
      <Navbar className='sticky top-0 w-full flex bg-white border-b border-gray-100 z-50' />
      <section className='flex flex-col flex-1 justify-start'>
        <div className='flex flex-col-reverse md:grid md:grid-cols-[4fr_8fr] lg:grid-cols-[3fr_9fr] xl:grid-cols-[2.5fr_9.5fr] 2xl:grid-cols-[2fr_10fr] auto-rows-fr self-stretch flex-1 w-full relative items-start'>
          <div className='w-full z-50 sticky flex flex-1 md:flex-col md:self-start bottom-0 md:bottom-auto md:top-[calc(3.5rem_+_1px)] md:h-full md:max-h-[calc(100vh_-_3.5rem_-_1px)]'>
            <Sidebar
              className='sticky top-0 w-full flex flex-1 bg-white z-50 border-r border-gray-100 border-t md:border-none'
              links={links}
            />
          </div>
          <div className='flex flex-1 flex-col'>{children}</div>
        </div>
      </section>
    </main>
  );
};

export default Layout;
