import Navbar from '@/app/(core)/ui/Navbar/Navbar';
import { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <main className='flex flex-col items-center justify-start'>
      <Navbar />
      <section className='flex flex-wrap lg:flex-nowrap w-full'>
        <div></div>
        <div></div>
        <div className=''></div>
        aboba
        {children}
      </section>
    </main>
  );
};

export default Layout;
