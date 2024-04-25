import { FC, HTMLAttributes, ReactNode } from 'react';
import { ApplicationRoutes } from '../../utils/routes.utils';
import Link from 'next/link';
import SidebarButtonsSection from './SidebarButtonsSection';
import { headers } from 'next/headers';

export interface SidebarLink {
  content: ReactNode;
  url: ApplicationRoutes;
  isActiveRegex: RegExp;
}

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  links: SidebarLink[];
}

const Sidebar: FC<SidebarProps> = ({ links, ...props }) => {
  return (
    <aside {...props}>
      <nav className='flex items-center justify-center gap-2 md:gap-0 md:flex-col md:justify-between w-full'>
        <div className='md:w-full flex justify-center md:flex-col gap-2 py-2 md:p-5'>
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              className={`${
                link.isActiveRegex.test(headers().get('x-pathname') || '')
                  ? 'bg-slate-100 text-rose-600'
                  : 'text-gray-500'
              } inline-flex p-3 md:px-5 md:py-3 font-medium hover:bg-slate-100 transition-[0.3s_ease] rounded-xl`}
            >
              {link.content}
            </Link>
          ))}
        </div>
        <SidebarButtonsSection className='md:w-full  md:p-5 flex md:flex-col' />
      </nav>
    </aside>
  );
};

export default Sidebar;
