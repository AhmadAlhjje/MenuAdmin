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
        'bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 p-6'
      )}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">{title}</h1>
      {description && (
        <p className="mt-2 text-secondary-600 dark:text-secondary-400">{description}</p>
      )}
    </div>
  );
};
