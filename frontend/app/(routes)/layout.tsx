import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import RootProvider from '../(core)/providers/RootProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Funders',
  description: 'Social network for volunteer fundraising',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
