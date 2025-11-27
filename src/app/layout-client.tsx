'use client';

import type React from 'react';
import { Sidebar } from '@/components/organisms';
import { useThemeStore } from '@/store/themeStore';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Providers } from '@/app/providers';

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export const RootLayoutClient: React.FC<RootLayoutClientProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();

  // Don't show sidebar on login page
  const showSidebar = pathname !== '/login';

  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem('language') || 'en';
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);

    // Update HTML attributes
    const htmlElement = document.documentElement;
    htmlElement.lang = savedLanguage;
    htmlElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    if (isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Providers>
      <div className="flex min-h-screen bg-white dark:bg-secondary-800">
        {showSidebar && <Sidebar />}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </Providers>
  );
};
