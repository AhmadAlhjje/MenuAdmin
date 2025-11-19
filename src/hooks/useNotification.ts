import { useNotificationStore } from '@/store/notificationStore';
import { Notification } from '@/types';

export const useNotification = () => {
  const { addNotification, removeNotification, clearNotifications } = useNotificationStore();

  const notify = {
    success: (message: string, duration = 3000) => {
      addNotification({
        message,
        type: 'success',
        duration,
      });
    },
    error: (message: string, duration = 5000) => {
      addNotification({
        message,
        type: 'error',
        duration,
      });
    },
    warning: (message: string, duration = 4000) => {
      addNotification({
        message,
        type: 'warning',
        duration,
      });
    },
    info: (message: string, duration = 3000) => {
      addNotification({
        message,
        type: 'info',
        duration,
      });
    },
  };

  return {
    notify,
    removeNotification,
    clearNotifications,
  };
};
