import { NotificationType } from '../../utils/notifications.utils';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  isActive: boolean;
}
