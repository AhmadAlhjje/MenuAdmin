'use client';

import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  as?: 'input' | 'textarea';
}

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, error, helperText, className, as = 'input', ...props }, ref) => {
    const Tag = as as any;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            {label}
          </label>
        )}
        <Tag
          ref={ref}
          className={clsx(
            'px-4 py-2 rounded-lg border-2 transition-colors duration-200',
            'bg-white dark:bg-secondary-800',
            'text-secondary-900 dark:text-secondary-100',
            'placeholder-secondary-400 dark:placeholder-secondary-500',
            'border-secondary-200 dark:border-secondary-700',
            'focus:outline-none focus:border-primary-500 dark:focus:border-primary-400',
            error && 'border-danger-500 focus:border-danger-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs font-medium text-danger-500">{error}</p>}
        {helperText && <p className="text-xs text-secondary-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
