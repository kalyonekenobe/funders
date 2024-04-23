import Navbar from '@/app/(core)/ui/Navbar/Navbar';
import Sidebar from '@/app/(core)/ui/Sidebar/Sidebar';
import { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <main className='flex flex-col min-h-screen'>
      <Navbar />
      <section className='flex flex-col flex-1 justify-start'>
        <div className='grid grid-cols-[1fr_2fr_1fr] auto-rows-fr self-stretch w-full relative items-start'>
          <div className='sticky top-[calc(4rem_+_2px)] h-full max-h-[calc(100vh_-_4em_-_2px)] flex flex-1 flex-col p-5 self-start'>
            <Sidebar
              className='border rounded-xl bg-white z-40 max-w-sm w-full flex flex-col flex-1'
              links={[]}
            />
          </div>
          <div className='flex flex-1 flex-col p-5'>{children}</div>
          <div className='flex flex-1 flex-col self-start'></div>
        </div>
      </section>
    </main>
  );
};

export default Layout;
