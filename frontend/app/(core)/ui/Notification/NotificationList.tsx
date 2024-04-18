import { FC } from 'react';
import { Notification } from '@/app/(core)/store/types/notification.types';
import { AnimatePresence, motion } from 'framer-motion';
import NotificationCard from './NotificationCard';

export interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList: FC<NotificationListProps> = ({ notifications }) => {
  return (
    <>
      {notifications.map(notification => (
        <AnimatePresence key={notification.id}>
          {notification.isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: '10%' }}
              animate={{ opacity: 1, scale: 1, y: '0%' }}
              exit={{ opacity: 0, scale: 0.8, y: '10%' }}
            >
              <NotificationCard notification={notification} />
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </>
  );
};

export default NotificationList;
