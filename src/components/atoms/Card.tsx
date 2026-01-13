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
        'rounded-xl bg-white dark:bg-slate-800',
        'border border-secondary-200 dark:border-slate-700',
        'shadow-lg hover:shadow-xl transition-all duration-300',
        'dark:shadow-2xl dark:shadow-black/40 dark:hover:shadow-black/50',
        'backdrop-blur-sm',
        'p-4 sm:p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
