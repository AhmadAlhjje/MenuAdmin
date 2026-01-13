'use client';

import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 whitespace-nowrap';

    const variants = {
      primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 shadow-soft hover:shadow-glow-primary dark:from-primary-600 dark:to-primary-500 dark:hover:from-primary-500 dark:hover:to-primary-400 dark:shadow-dark dark:hover:shadow-glow-primary active:scale-[0.98] font-semibold',
      secondary: 'bg-surface dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark border-2 border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-surface-dark-hover hover:border-primary-300 dark:hover:border-primary-700 shadow-soft hover:shadow-soft-lg dark:shadow-dark active:scale-[0.98]',
      danger: 'bg-gradient-to-r from-error-500 to-error-600 text-white hover:from-error-600 hover:to-error-700 active:from-error-700 active:to-error-800 shadow-soft hover:shadow-glow-accent dark:shadow-dark dark:hover:shadow-glow-accent active:scale-[0.98] font-semibold',
      success: 'bg-gradient-to-r from-success-500 to-success-600 text-white hover:from-success-600 hover:to-success-700 active:from-success-700 active:to-success-800 shadow-soft hover:shadow-glow-success dark:shadow-dark dark:hover:shadow-glow-success active:scale-[0.98] font-semibold',
      outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white hover:shadow-glow-primary dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-400 dark:hover:border-primary-300 dark:hover:shadow-glow-primary active:scale-95 shadow-soft backdrop-blur-sm',
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm min-h-[36px]',
      md: 'px-4 py-2.5 text-base min-h-[42px]',
      lg: 'px-6 py-3 text-lg min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
