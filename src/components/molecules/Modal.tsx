'use client';

import React from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'w-full max-w-sm',
    md: 'w-full max-w-md',
    lg: 'w-full max-w-lg',
    xl: 'w-full max-w-xl',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className={clsx(
        'bg-white dark:bg-secondary-800 rounded-xl shadow-xl my-8',
        'max-h-[calc(100vh-4rem)]',
        sizes[size]
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-secondary-200 dark:border-secondary-700">
          <h2 className="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-16rem)]">{children}</div>

        {/* Actions */}
        {actions && <div className="flex flex-col sm:flex-row gap-3 px-4 sm:px-6 pb-4 sm:pb-6 justify-end">{actions}</div>}
      </div>
    </div>
  );
};
