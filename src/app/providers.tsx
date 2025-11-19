'use client';

import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import { NotificationContainer } from '@/components/molecules';
import { useThemeStore } from '@/store/themeStore';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setTheme(isDark);

    // Initialize language from localStorage
    const savedLanguage = localStorage.getItem('language') || 'en';
    i18n.changeLanguage(savedLanguage);
  }, [setTheme]);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
      <NotificationContainer />
    </I18nextProvider>
  );
};
