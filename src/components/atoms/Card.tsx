'use client';

import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={clsx(
        'rounded-xl bg-surface dark:bg-surface-dark',
        'border border-border-light dark:border-border-dark',
        'shadow-soft hover:shadow-soft-lg transition-all duration-300',
        'dark:shadow-dark dark:hover:shadow-dark-lg',
        'backdrop-blur-sm',
        'p-4 sm:p-6',
        'relative overflow-hidden',
        // خلفية متدرجة خفيفة في Dark Mode
        'dark:before:absolute dark:before:inset-0 dark:before:bg-gradient-to-br dark:before:from-surface-dark dark:before:via-surface-dark dark:before:to-background-dark-elevated dark:before:opacity-50 dark:before:-z-10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
