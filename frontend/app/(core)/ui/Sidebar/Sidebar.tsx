import { FC, HTMLAttributes, ReactNode } from 'react';
import { ApplicationRoutes } from '../../utils/routes.utils';
import Link from 'next/link';

export interface SidebarLink {
  content: ReactNode;
  url: ApplicationRoutes;
}

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  links: SidebarLink[];
}

const Sidebar: FC<SidebarProps> = ({ links, ...props }) => {
  return (
    <aside {...props}>
      <nav>
        {links.map((link, index) => (
          <Link key={index} href={link.url}>
            {link.content}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
