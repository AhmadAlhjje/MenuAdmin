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
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
            {label}
          </label>
        )}
        <Tag
          ref={ref}
          className={clsx(
            'px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 transition-all duration-300',
            'bg-surface dark:bg-surface-dark',
            'text-sm sm:text-base text-text-primary-light dark:text-text-primary-dark',
            'placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark',
            'border-border-light dark:border-border-dark',
            'focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/40',
            'hover:border-primary-300 dark:hover:border-primary-600',
            'shadow-soft focus:shadow-soft-lg dark:shadow-inner-dark dark:focus:shadow-dark',
            'w-full backdrop-blur-sm',
            'dark:bg-opacity-80',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-100 dark:focus:ring-error-900/40 dark:border-error-600',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs font-medium text-error-600 dark:text-error-400">{error}</p>}
        {helperText && <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
