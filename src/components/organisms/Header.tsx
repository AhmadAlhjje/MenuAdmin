'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

interface HeaderProps {
  title: string;
  description?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, description }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div
      className={clsx(
        'bg-white dark:bg-slate-900 border-b border-secondary-200 dark:border-slate-700',
        'p-4 sm:p-6 lg:p-8',
        'backdrop-blur-sm'
      )}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-slate-100">{title}</h1>
      {description && (
        <p className="mt-2 text-sm sm:text-base text-secondary-600 dark:text-slate-400">{description}</p>
      )}
    </div>
  );
};
