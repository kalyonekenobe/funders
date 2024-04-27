import { FC, HTMLAttributes } from 'react';
import SidebarButtonsSection from './SidebarButtonsSection';
import SidebarLink, { SidebarLink as SidebarLinkType } from './SidebarLink';

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  links: SidebarLinkType[];
}

const Sidebar: FC<SidebarProps> = ({ links, ...props }) => {
  return (
    <aside {...props}>
      <nav className='flex items-center justify-center gap-2 md:gap-0 md:flex-col md:justify-between w-full'>
        <div className='md:w-full flex justify-center md:flex-col gap-2 py-2 md:p-5'>
          {links.map((link, index) => (
            <SidebarLink key={index} url={link.url}>
              {link.content}
            </SidebarLink>
          ))}
        </div>
        <SidebarButtonsSection className='md:w-full  md:p-5 flex md:flex-col' />
      </nav>
    </aside>
  );
};

export default Sidebar;
