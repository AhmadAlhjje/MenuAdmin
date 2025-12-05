'use client';

import type React from 'react';
import { Sidebar } from '@/components/organisms';
import { useThemeStore } from '@/store/themeStore';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Providers } from '@/app/providers';
import { Menu } from 'lucide-react';

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export const RootLayoutClient: React.FC<RootLayoutClientProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Don't close sidebar on route change - let user control it
  // useEffect(() => {
  //   setSidebarOpen(false);
  // }, [pathname]);

  if (!mounted) {
    return null;
  }

  const isRTL = typeof window !== 'undefined' && document.documentElement.dir === 'rtl';

  return (
    <Providers>
      <div className="flex min-h-screen bg-secondary-50 dark:bg-secondary-900">
        {showSidebar && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onToggle={() => setSidebarOpen(!sidebarOpen)} />}

        <main
          className="flex-1 overflow-auto flex flex-col transition-all duration-300"
          style={{
            marginLeft: !isRTL && sidebarOpen ? '256px' : '0',
            marginRight: isRTL && sidebarOpen ? '256px' : '0',
          }}
        >
          {showSidebar && (
            <div className="sticky top-0 z-30">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`m-4 p-2.5 sm:p-3 bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors active:scale-95 ${sidebarOpen ? 'lg:hidden' : ''}`}
                aria-label="Open menu"
              >
                <Menu size={22} className="text-secondary-700 dark:text-secondary-300" />
              </button>
            </div>
          )}
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </Providers>
  );
};
