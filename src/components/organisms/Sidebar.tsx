'use client';

import React from 'react';
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
      <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-600">
            MenuAdmin
          </h1>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
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
                  <p className="text-xs font-semibold text-secondary-500 uppercase px-3 py-2">
                    {route.label}
                  </p>
                  <div className="space-y-1">
                    {hasItems && route.items?.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={clsx(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                            isActive(item.href)
                              ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-medium'
                              : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                          )}
                        >
                          <ItemIcon size={20} className="flex-shrink-0" />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </>
              ) : (
                <Link
                  href={route.href || '#'}
                  onClick={onClose}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive(route.href || '')
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                  )}
                >
                  {Icon && <Icon size={20} className="flex-shrink-0" />}
                  <span className="text-sm">{route.label}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-secondary-200 dark:border-secondary-700 space-y-2">
        <button
          onClick={toggleTheme}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
            'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
          )}
        >
          {isDark ? <Sun size={20} className="flex-shrink-0" /> : <Moon size={20} className="flex-shrink-0" />}
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
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            'bg-secondary-100 dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 hover:bg-secondary-200 dark:hover:bg-secondary-600'
          )}
        >
          <span className="flex-shrink-0">🌐</span>
          <span>{i18n.language === 'en' ? 'العربية' : 'English'}</span>
        </button>

        <button
          onClick={handleLogout}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            'text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20'
          )}
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span>{t('common.logout')}</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Overlay - Only on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 h-screen bg-white dark:bg-secondary-800',
          'flex flex-col transition-transform duration-300 ease-in-out z-50',
          'w-64',
          isRTL ? 'right-0 border-l border-secondary-200 dark:border-secondary-700' : 'left-0 border-r border-secondary-200 dark:border-secondary-700',
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
