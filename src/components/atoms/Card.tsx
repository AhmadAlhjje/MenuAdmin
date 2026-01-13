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
        'shadow-sm hover:shadow-lg transition-all duration-300',
        'p-4 sm:p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
