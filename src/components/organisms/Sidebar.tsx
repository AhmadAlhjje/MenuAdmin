'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Grid3x3,
  Armchair,
  Settings,
  LogOut,
  Moon,
  Sun,
  TrendingUp,
  BarChart3,
  ChefHat,
  X,
  Loader2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/store/themeStore';
import { useNotification } from '@/hooks/useNotification';
import { authService } from '@/api/services/authService';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onToggle }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { isDark, toggleTheme } = useThemeStore();
  const { notify } = useNotification();
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);

  // Reset navigation state when pathname changes
  useEffect(() => {
    setIsNavigating(false);
    setTargetPath(null);
  }, [pathname]);

  const handleNavigation = (href: string, e: React.MouseEvent) => {
    if (pathname !== href) {
      setIsNavigating(true);
      setTargetPath(href);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();

      // Clear token from cookies
      document.cookie = 'authToken=; path=/; max-age=0';
      document.cookie = 'refreshToken=; path=/; max-age=0';

      notify.success(t('common.logout'));

      router.push('/login');
    } catch {
      // Clear cookies even if logout fails
      document.cookie = 'authToken=; path=/; max-age=0';
      document.cookie = 'refreshToken=; path=/; max-age=0';

      notify.info('Logged out');

      router.push('/login');
    }
  };

  const routes = [
    {
      label: t('sidebar.admin'),
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: t('sidebar.menuManagement'),
      items: [
        { label: t('navigation.categories'), href: '/admin/categories', icon: Grid3x3 },
        { label: t('navigation.items'), href: '/admin/items', icon: UtensilsCrossed },
      ],
    },
    {
      label: t('sidebar.tableManagement'),
      href: '/admin/tables',
      icon: Armchair,
    },
    {
      label: isRTL ? 'المطابخ' : 'Kitchens',
      href: '/admin/users',
      icon: ChefHat,
    },
    {
      label: isRTL ? 'التقارير' : 'Reports',
      items: [
        { label: isRTL ? 'الأصناف الأكثر طلباً' : 'Popular Items', href: '/admin/reports/popular-items', icon: TrendingUp },
        { label: isRTL ? 'تقارير المبيعات' : 'Sales Report', href: '/admin/reports/sales', icon: BarChart3 },
      ],
    },
    {
      label: t('common.settings'),
      href: '/settings',
      icon: Settings,
    },
  ];

  const isActive = (href: string) => pathname === href;

  const sidebarContent = (
    <>
      {/* Logo and Close Button */}
      <div className="p-6 border-b-2 border-border-light dark:border-border-dark bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-700 dark:to-primary-600 relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between relative z-10">
          <h1 className="text-2xl font-black text-white drop-shadow-lg tracking-tight">
            MenuAdmin
          </h1>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-white/20 rounded-lg transition-all text-white hover:scale-110 active:scale-95"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-2 p-4">
        {routes.map((route, idx) => {
          const Icon = route.icon;
          const hasItems = 'items' in route;

          return (
            <div key={idx}>
              {hasItems ? (
                <>
                  <p className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark uppercase px-4 py-2 tracking-wide">
                    {route.label}
                  </p>
                  <div className="space-y-1">
                    {hasItems && route.items?.map((item) => {
                      const ItemIcon = item.icon;
                      const isLoadingThis = isNavigating && targetPath === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={(e) => handleNavigation(item.href, e)}
                          className={clsx(
                            'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                            isActive(item.href)
                              ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold shadow-lg shadow-primary-500/30 dark:shadow-primary-500/40'
                              : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gradient-to-r hover:from-primary-500/10 hover:to-primary-400/10 dark:hover:from-primary-500/20 dark:hover:to-primary-400/20 hover:text-primary-600 dark:hover:text-primary-400 font-medium',
                            isLoadingThis && 'opacity-70 pointer-events-none'
                          )}
                        >
                          {isLoadingThis ? (
                            <Loader2 size={22} className="flex-shrink-0 animate-spin" />
                          ) : (
                            <ItemIcon size={22} className="flex-shrink-0" />
                          )}
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </>
              ) : (
                (() => {
                  const isLoadingThis = isNavigating && targetPath === route.href;
                  return (
                    <Link
                      href={route.href || '#'}
                      onClick={(e) => handleNavigation(route.href || '#', e)}
                      className={clsx(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                        isActive(route.href || '')
                          ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold shadow-lg shadow-primary-500/30 dark:shadow-primary-500/40'
                          : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gradient-to-r hover:from-primary-500/10 hover:to-primary-400/10 dark:hover:from-primary-500/20 dark:hover:to-primary-400/20 hover:text-primary-600 dark:hover:text-primary-400 font-medium',
                        isLoadingThis && 'opacity-70 pointer-events-none'
                      )}
                    >
                      {isLoadingThis ? (
                        <Loader2 size={22} className="flex-shrink-0 animate-spin" />
                      ) : (
                        Icon && <Icon size={22} className="flex-shrink-0" />
                      )}
                      <span className="text-sm">{route.label}</span>
                    </Link>
                  );
                })()
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-secondary-200 dark:border-slate-700 bg-gradient-to-r from-secondary-50 to-white dark:from-slate-800 dark:to-slate-900 space-y-2 relative overflow-hidden">
        {/* تأثير وهج خفيف */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent dark:from-primary-500/10 dark:to-transparent pointer-events-none"></div>
        <button
          onClick={toggleTheme}
          className={clsx(
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative z-10',
            'text-text-primary-light dark:text-text-primary-dark hover:bg-gradient-to-r hover:from-primary-500/10 hover:to-primary-400/10 dark:hover:from-primary-500/20 dark:hover:to-primary-400/20 hover:text-primary-600 dark:hover:text-primary-400 shadow-soft hover:scale-105 active:scale-95 dark:shadow-dark font-medium'
          )}
        >
          {isDark ? <Sun size={22} className="flex-shrink-0" /> : <Moon size={22} className="flex-shrink-0" />}
          <span className="text-sm">{isDark ? t('common.lightMode') : t('common.darkMode')}</span>
        </button>

        <button
          onClick={() => {
            i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
            localStorage.setItem('language', i18n.language === 'en' ? 'ar' : 'en');
            const htmlElement = document.documentElement;
            htmlElement.lang = i18n.language === 'en' ? 'ar' : 'en';
            htmlElement.dir = i18n.language === 'en' ? 'rtl' : 'ltr';
          }}
          className={clsx(
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative z-10',
            'text-text-primary-light dark:text-text-primary-dark hover:bg-gradient-to-r hover:from-primary-500/10 hover:to-primary-400/10 dark:hover:from-primary-500/20 dark:hover:to-primary-400/20 hover:text-primary-600 dark:hover:text-primary-400 shadow-soft hover:scale-105 active:scale-95 dark:shadow-dark'
          )}
        >
          <span className="flex-shrink-0 text-xl">🌐</span>
          <span>{i18n.language === 'en' ? 'العربية' : 'English'}</span>
        </button>

        <button
          onClick={handleLogout}
          className={clsx(
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-300 relative z-10',
            'bg-gradient-to-r from-error-600 to-error-500 text-white shadow-lg shadow-error-500/30 dark:shadow-error-500/40 hover:from-error-700 hover:to-error-600 hover:scale-105 active:scale-95'
          )}
        >
          <LogOut size={22} className="flex-shrink-0" />
          <span>{t('common.logout')}</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Loading Bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-[100]">
          <div className="h-1.5 bg-gradient-to-r from-primary-500 to-primary-600 animate-pulse shadow-glow-primary">
            <div className="h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
        </div>
      )}

      {/* Overlay - Only on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 h-screen bg-white dark:bg-slate-900',
          'flex flex-col transition-all duration-300 ease-in-out z-50',
          'w-64 shadow-2xl dark:shadow-black/50',
          'backdrop-blur-md dark:backdrop-blur-lg',
          // تأثير حدود متوهجة في Dark Mode
          isRTL ? 'right-0 border-l-2 border-secondary-200 dark:border-slate-700' : 'left-0 border-r-2 border-secondary-200 dark:border-slate-700',
          isRTL ? (
            isOpen ? 'translate-x-0' : 'translate-x-full'
          ) : (
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
