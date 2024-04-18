import { NotificationType } from '../../utils/notifications.utils';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  isActive: boolean;
}
