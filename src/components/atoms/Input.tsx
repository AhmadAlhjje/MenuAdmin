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
            'bg-white dark:bg-slate-800',
            'text-sm sm:text-base text-secondary-900 dark:text-slate-100',
            'placeholder:text-secondary-400 dark:placeholder:text-slate-500',
            'border-secondary-300 dark:border-slate-600',
            'focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-500/20',
            'hover:border-primary-300 dark:hover:border-primary-500',
            'shadow-sm focus:shadow-md dark:shadow-black/20 dark:focus:shadow-black/40',
            'w-full backdrop-blur-sm',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-100 dark:focus:ring-error-500/20 dark:border-error-500',
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
