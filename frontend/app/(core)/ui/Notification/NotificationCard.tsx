'use client';

import { FC, useMemo } from 'react';
import { Notification } from '../../store/types/notification.types';
import { NotificationType } from '../../utils/notifications.utils';
import { CloseIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '../Icons/Icons';
import useNotification from '../../hooks/notifications.hooks';

export interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard: FC<NotificationCardProps> = ({ notification }) => {
  const { deactivateNotification } = useNotification();

  const styles = useMemo(() => {
    switch (notification.type) {
      case NotificationType.Success:
        return 'border-l-[0.75rem] border-emerald-500';
      case NotificationType.Info:
        return 'border-l-[0.75rem] border-blue-500';
      case NotificationType.Warning:
        return 'border-l-[0.75rem] border-yellow-500';
      case NotificationType.Error:
        return 'border-l-[0.75rem] border-red-500';
      default:
        return 'border-l-[0.75rem] border-slate-200';
    }
  }, [notification]);

  return (
    <div className={`flex bg-white rounded-xl shadow-xl w-full px-3 py-2 ${styles}`}>
      <div className='flex items-center justify-center'>
        {notification.type === NotificationType.Success && (
          <SuccessIcon className='size-10 text-emerald-500' />
        )}
        {notification.type === NotificationType.Info && (
          <InfoIcon className='size-10 text-blue-500' />
        )}
        {notification.type === NotificationType.Warning && (
          <WarningIcon className='size-10 text-yellow-500' />
        )}
        {notification.type === NotificationType.Error && (
          <ErrorIcon className='size-10 text-red-500' />
        )}
      </div>
      <div className='flex flex-col ms-3'>
        <h3 className='font-semibold text text-gray-700 mb-0.5'>{notification.type}</h3>
        <span className='text-sm'>{notification.message}</span>
      </div>
      <div className='flex justify-end py-1'>
        <CloseIcon
          className='size-5 cursor-pointer'
          onClick={() => deactivateNotification(notification.id)}
        />
      </div>
    </div>
  );
};

export default NotificationCard;
