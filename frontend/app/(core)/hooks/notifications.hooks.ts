import { useContext } from 'react';
import NotificationContext from '../contexts/NotificationContext';

const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification hook must be used within NotificationContext');
  }

  return context;
};

export default useNotification;
