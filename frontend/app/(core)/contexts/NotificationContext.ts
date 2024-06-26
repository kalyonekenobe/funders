'use client';

import { createContext } from 'react';
import { Notification } from '../store/types/notification.types';

export interface NotificationContextValueType {
  notifications: Notification[];
  createNotification: (
    notification: Omit<Notification, 'id' | 'isActive'>,
    duration?: number,
  ) => Notification['id'];
  deactivateNotification: (id: Notification['id'], duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextValueType>({
  notifications: [],
  createNotification: () => '',
  deactivateNotification: () => {},
});

export default NotificationContext;
