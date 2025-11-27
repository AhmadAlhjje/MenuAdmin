'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import clsx from 'clsx';

export const NotificationContainer: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { notifications, removeNotification } = useNotificationStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const iconMap = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />,
  };

  const bgMap = {
    success: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800',
    error: 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800',
    warning: 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800',
    info: 'bg-info-50 dark:bg-info-900/20 border-info-200 dark:border-info-800',
  };

  const textColorMap = {
    success: 'text-success-600 dark:text-success-400',
    error: 'text-danger-600 dark:text-danger-400',
    warning: 'text-warning-600 dark:text-warning-400',
    info: 'text-info-600 dark:text-info-400',
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[1000] space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={clsx(
            'flex items-start gap-3 p-4 rounded-lg border',
            bgMap[notification.type],
            'animate-in fade-in slide-in-from-top-2 duration-300'
          )}
        >
          <span className={clsx('flex-shrink-0 mt-0.5', textColorMap[notification.type])}>
            {iconMap[notification.type]}
          </span>
          <p className={clsx('flex-1 text-sm font-medium', textColorMap[notification.type])}>
            {notification.message}
          </p>
          <button
            onClick={() => removeNotification(notification.id)}
            className={clsx(
              'flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors',
              textColorMap[notification.type]
            )}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
