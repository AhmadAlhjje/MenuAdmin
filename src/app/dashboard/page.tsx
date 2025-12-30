'use client';

import { useTranslation } from 'react-i18next';
import { Header } from '@/components/organisms';
import { Card } from '@/components/atoms';
import {
  BarChart3,
  UtensilsCrossed,
  Grid3x3,
  Armchair,
  Users,
  ShoppingCart,
  TrendingUp,
  Activity,
  ChefHat,
} from 'lucide-react';
import Link from 'next/link';
import { useAsync } from '@/hooks/useAsync';
import { reportService } from '@/api/services/reportService';
import clsx from 'clsx';

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { data: dashboardData, status } = useAsync(
    () => reportService.getDashboardStats(),
    true
  );

  const stats = dashboardData?.data;

  const quickLinks = [
    {
      title: t('navigation.categories'),
      icon: Grid3x3,
      href: '/admin/categories',
      color: 'primary',
    },
    {
      title: t('navigation.items'),
      icon: UtensilsCrossed,
      href: '/admin/items',
      color: 'success',
    },
    {
      title: t('navigation.tables'),
      icon: Armchair,
      href: '/admin/tables',
      color: 'info',
    },
    {
      title: isRTL ? 'المطابخ' : 'Kitchens',
      icon: ChefHat,
      href: '/admin/users',
      color: 'warning',
    },
  ];

  return (
    <>
      <Header
        title={t('common.dashboard')}
        description={isRTL ? 'مرحباً بك في لوحة تحكم المطعم' : 'Welcome to your restaurant admin dashboard'}
      />
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats Overview */}
        {status === 'loading' && (
          <Card className="mb-8">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent mb-4"></div>
              <p className="text-secondary-600 dark:text-secondary-400">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
          </Card>
        )}

        {status === 'success' && stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Active Sessions */}
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                      {isRTL ? 'الجلسات النشطة' : 'Active Sessions'}
                    </p>
                    <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                      {stats.activeSessions}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-info-100 dark:bg-info-900/20 flex items-center justify-center">
                    <Activity size={24} className="text-info-600 dark:text-info-400" />
                  </div>
                </div>
              </Card>

              {/* Today's Sales */}
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                      {isRTL ? 'مبيعات اليوم' : "Today's Sales"}
                    </p>
                    <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                      ل.س {parseFloat(stats.todaySales).toFixed(0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-success-100 dark:bg-success-900/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-success-600 dark:text-success-400">ل.س</span>
                  </div>
                </div>
              </Card>

              {/* Active Orders */}
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                      {isRTL ? 'الطلبات النشطة' : 'Active Orders'}
                    </p>
                    <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                      {stats.activeOrders}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-warning-100 dark:bg-warning-900/20 flex items-center justify-center">
                    <ShoppingCart size={24} className="text-warning-600 dark:text-warning-400" />
                  </div>
                </div>
              </Card>

              {/* Avg Session Value */}
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                      {isRTL ? 'متوسط الجلسة' : 'Avg Session'}
                    </p>
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      ل.س {parseFloat(stats.avgSessionValue || '0').toFixed(0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                    <TrendingUp size={24} className="text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Table Occupancy */}
            <Card className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-info-100 dark:bg-info-900/20 flex items-center justify-center">
                    <Armchair size={20} className="text-info-600 dark:text-info-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-100">
                      {isRTL ? 'إشغال الطاولات' : 'Table Occupancy'}
                    </h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {stats.occupiedTables} {isRTL ? 'من' : 'of'} {stats.totalTables} {isRTL ? 'طاولات مشغولة' : 'tables occupied'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-info-600 dark:text-info-400">
                    {stats.occupancyRate.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-3 overflow-hidden">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all duration-500',
                    stats.occupancyRate > 80 ? 'bg-danger-500' : stats.occupancyRate > 50 ? 'bg-warning-500' : 'bg-info-500'
                  )}
                  style={{ width: `${stats.occupancyRate}%` }}
                ></div>
              </div>
            </Card>
          </>
        )}

        {/* Quick Links */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
            {isRTL ? 'الوصول السريع' : 'Quick Access'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                    <div className="flex flex-col items-center justify-center text-center gap-4">
                      <div className={clsx(
                        'p-4 rounded-lg',
                        link.color === 'primary' && 'bg-primary-100 dark:bg-primary-900/20',
                        link.color === 'success' && 'bg-success-100 dark:bg-success-900/20',
                        link.color === 'info' && 'bg-info-100 dark:bg-info-900/20',
                        link.color === 'warning' && 'bg-warning-100 dark:bg-warning-900/20'
                      )}>
                        <Icon size={32} className={clsx(
                          link.color === 'primary' && 'text-primary-600 dark:text-primary-400',
                          link.color === 'success' && 'text-success-600 dark:text-success-400',
                          link.color === 'info' && 'text-info-600 dark:text-info-400',
                          link.color === 'warning' && 'text-warning-600 dark:text-warning-400'
                        )} />
                      </div>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                        {link.title}
                      </h3>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Reports Links */}
        <div>
          <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
            {isRTL ? 'التقارير' : 'Reports'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/admin/reports/popular-items">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-warning-100 dark:bg-warning-900/20 flex items-center justify-center">
                    <TrendingUp size={24} className="text-warning-600 dark:text-warning-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                      {isRTL ? 'الأصناف الأكثر طلباً' : 'Popular Items'}
                    </h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {isRTL ? 'تقرير بالأصناف الأكثر مبيعاً' : 'Best-selling items report'}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/admin/reports/sales">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-success-100 dark:bg-success-900/20 flex items-center justify-center">
                    <BarChart3 size={24} className="text-success-600 dark:text-success-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                      {isRTL ? 'تقارير المبيعات' : 'Sales Report'}
                    </h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {isRTL ? 'تقرير مفصل بالمبيعات والإيرادات' : 'Detailed sales and revenue report'}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
