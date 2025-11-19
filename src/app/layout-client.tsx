'use client';

import type React from 'react';
import { Providers } from '@/app/providers';
import { Sidebar } from '@/components/organisms';
import { useThemeStore } from '@/store/themeStore';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export const RootLayoutClient: React.FC<RootLayoutClientProps> = ({ children }) => {
  const { isDark } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Don't show sidebar on login page
  const showSidebar = pathname !== '/login';

  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem('language') || 'en';

    // Update HTML attributes
    const htmlElement = document.documentElement;
    htmlElement.lang = savedLanguage;
    htmlElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
  }, []);

  useEffect(() => {
    // Update dark mode class when isDark changes
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [isDark]);

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
