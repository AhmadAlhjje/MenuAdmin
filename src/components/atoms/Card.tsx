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
        'rounded-xl bg-white dark:bg-secondary-800',
        'border border-secondary-200 dark:border-secondary-700',
        'shadow-sm hover:shadow-md transition-shadow',
        'p-4 sm:p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
