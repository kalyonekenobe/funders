import { FC, ReactNode } from 'react';
import NotificationProvider from './NotificationProvider';

export interface RootProviderProps {
  children: ReactNode | ReactNode[];
}

const RootProvider: FC<RootProviderProps> = ({ children }) => {
  return <NotificationProvider>{children}</NotificationProvider>;
};

export default RootProvider;
