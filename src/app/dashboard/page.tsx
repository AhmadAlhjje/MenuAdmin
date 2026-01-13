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
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary-200 dark:border-primary-600 border-t-primary-500 dark:border-t-primary-400 mb-4 shadow-glow-primary"></div>
              <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
          </Card>
        )}

        {status === 'success' && stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Active Sessions */}
              <Card className="border-l-4 border-l-primary-500 dark:border-l-primary-400 hover:shadow-soft-xl hover:border-primary-600 dark:hover:border-primary-300 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1 font-medium">
                      {isRTL ? 'الجلسات النشطة' : 'Active Sessions'}
                    </p>
                    <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {stats.activeSessions}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-500/20 dark:to-primary-600/20 flex items-center justify-center shadow-soft group-hover:shadow-glow-primary transition-all">
                    <Activity size={28} className="text-primary-500 dark:text-primary-400" />
                  </div>
                </div>
              </Card>

              {/* Today's Sales */}
              <Card className="border-l-4 border-l-success-500 dark:border-l-success-400 hover:shadow-soft-xl hover:border-success-600 dark:hover:border-success-300 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1 font-medium">
                      {isRTL ? 'مبيعات اليوم' : "Today's Sales"}
                    </p>
                    <p className="text-3xl font-bold text-success-600 dark:text-success-400 group-hover:scale-105 transition-transform">
                      ل.س {parseFloat(stats.todaySales).toFixed(0)}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-success-50 to-success-100 dark:from-success-500/20 dark:to-success-600/20 flex items-center justify-center shadow-soft group-hover:shadow-glow-success transition-all">
                    <span className="text-2xl font-bold text-success-600 dark:text-success-400">ل.س</span>
                  </div>
                </div>
              </Card>

              {/* Active Orders */}
              <Card className="border-l-4 border-l-warning-500 dark:border-l-warning-400 hover:shadow-soft-xl hover:border-warning-600 dark:hover:border-warning-300 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1 font-medium">
                      {isRTL ? 'الطلبات النشطة' : 'Active Orders'}
                    </p>
                    <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-warning-600 dark:group-hover:text-warning-400 transition-colors">
                      {stats.activeOrders}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-500/20 dark:to-warning-600/20 flex items-center justify-center shadow-soft group-hover:scale-110 transition-all">
                    <ShoppingCart size={28} className="text-warning-500 dark:text-warning-400" />
                  </div>
                </div>
              </Card>

              {/* Avg Session Value */}
              <Card className="border-l-4 border-l-accent-500 dark:border-l-accent-400 hover:shadow-soft-xl hover:border-accent-600 dark:hover:border-accent-300 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1 font-medium">
                      {isRTL ? 'متوسط الجلسة' : 'Avg Session'}
                    </p>
                    <p className="text-3xl font-bold text-accent-600 dark:text-accent-400 group-hover:scale-105 transition-transform">
                      ل.س {parseFloat(stats.avgSessionValue || '0').toFixed(0)}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-500/20 dark:to-accent-600/20 flex items-center justify-center shadow-soft group-hover:shadow-glow-accent transition-all">
                    <TrendingUp size={28} className="text-accent-500 dark:text-accent-400" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Table Occupancy */}
            <Card className="mb-8 border-l-4 border-l-primary-500 dark:border-l-primary-400 hover:shadow-soft-xl hover:border-primary-600 dark:hover:border-primary-300 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-500/20 dark:to-primary-600/20 flex items-center justify-center shadow-soft group-hover:shadow-glow-primary transition-all">
                    <Armchair size={24} className="text-primary-500 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {isRTL ? 'إشغال الطاولات' : 'Table Occupancy'}
                    </h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                      {stats.occupiedTables} {isRTL ? 'من' : 'of'} {stats.totalTables} {isRTL ? 'طاولات مشغولة' : 'tables occupied'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform drop-shadow-lg">
                    {stats.occupancyRate.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="relative w-full bg-gradient-to-r from-border-light to-border-DEFAULT dark:from-border-dark dark:to-background-dark rounded-full h-5 overflow-hidden shadow-inner dark:shadow-inner-dark">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden',
                    stats.occupancyRate > 80 ? 'bg-gradient-to-r from-error-500 to-error-600 shadow-glow-accent dark:shadow-glow-accent' :
                    stats.occupancyRate > 50 ? 'bg-gradient-to-r from-warning-500 to-warning-600 dark:from-warning-400 dark:to-warning-500' :
                    'bg-gradient-to-r from-success-500 to-success-600 shadow-glow-success dark:shadow-glow-success'
                  )}
                  style={{ width: `${stats.occupancyRate}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/20 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
            {isRTL ? 'الوصول السريع' : 'Quick Access'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <Card className="cursor-pointer hover:shadow-soft-xl hover:border-primary-500 dark:hover:border-primary-400 hover:scale-105 transition-all duration-300 h-full group">
                    <div className="flex flex-col items-center justify-center text-center gap-4">
                      <div className={clsx(
                        'p-5 rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-soft',
                        link.color === 'primary' && 'bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 group-hover:shadow-glow-primary',
                        link.color === 'success' && 'bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 group-hover:shadow-glow-success',
                        link.color === 'info' && 'bg-gradient-to-br from-info-50 to-info-100 dark:from-info-900/20 dark:to-info-800/20',
                        link.color === 'warning' && 'bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-800/20'
                      )}>
                        <Icon size={40} className={clsx(
                          link.color === 'primary' && 'text-primary-500 dark:text-primary-400',
                          link.color === 'success' && 'text-success-500 dark:text-success-400',
                          link.color === 'info' && 'text-info-500 dark:text-info-400',
                          link.color === 'warning' && 'text-warning-500 dark:text-warning-400'
                        )} />
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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
          <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
            {isRTL ? 'التقارير' : 'Reports'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/admin/reports/popular-items">
              <Card className="cursor-pointer hover:shadow-soft-xl hover:border-warning-500 dark:hover:border-warning-400 hover:scale-[1.02] transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-800/20 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-soft">
                    <TrendingUp size={32} className="text-warning-500 dark:text-warning-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-warning-600 dark:group-hover:text-warning-400 transition-colors">
                      {isRTL ? 'الأصناف الأكثر طلباً' : 'Popular Items'}
                    </h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                      {isRTL ? 'تقرير بالأصناف الأكثر مبيعاً' : 'Best-selling items report'}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/admin/reports/sales">
              <Card className="cursor-pointer hover:shadow-soft-xl hover:border-success-500 dark:hover:border-success-400 hover:scale-[1.02] transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-soft group-hover:shadow-glow-success">
                    <BarChart3 size={32} className="text-success-500 dark:text-success-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-success-600 dark:group-hover:text-success-400 transition-colors">
                      {isRTL ? 'تقارير المبيعات' : 'Sales Report'}
                    </h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
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
