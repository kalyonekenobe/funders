'use client';

import { usePathname } from 'next/navigation';
import { FC, LinkHTMLAttributes, ReactNode } from 'react';
import { ApplicationRoutes, RouteMatcher } from '../../utils/routes.utils';
import Link from 'next/link';

export interface SidebarLink {
  content: ReactNode;
  url: ApplicationRoutes;
}

export interface SidebarLinkProps
  extends Omit<SidebarLink, 'content'>,
    LinkHTMLAttributes<HTMLLinkElement> {}

const SidebarLink: FC<SidebarLinkProps> = ({ url, children, ...props }) => {
  const pathname = usePathname();

  return (
    <Link
      href={url}
      className={`${
        RouteMatcher[url].test(pathname) ? 'bg-slate-100 text-rose-600' : 'text-gray-500'
      } inline-flex items-center p-3 md:px-5 md:py-3 font-medium hover:bg-slate-100 transition-[0.3s_ease] rounded-xl`}
    >
      {children}
    </Link>
  );
};

export default SidebarLink;
