'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/organisms';
import { Card } from '@/components/atoms';
import { reportService, PopularItem } from '@/api/services/reportService';
import { useAsync } from '@/hooks/useAsync';
import {
  TrendingUp,
  Package,
  DollarSign,
  ShoppingCart,
  Award,
  BarChart3,
} from 'lucide-react';
import clsx from 'clsx';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PopularItemsPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [dateRange, setDateRange] = useState<{ startDate?: string; endDate?: string }>({});

  const { data: reportData, status, execute: refetchReport } = useAsync(
    () => reportService.getPopularItems(dateRange),
    true
  );

  const popularItems = reportData?.data || [];

  const getTopBadge = (index: number) => {
    const badges = [
      { bg: 'bg-warning-500', icon: '🥇', text: isRTL ? 'الأول' : '1st' },
      { bg: 'bg-secondary-400', icon: '🥈', text: isRTL ? 'الثاني' : '2nd' },
      { bg: 'bg-orange-600', icon: '🥉', text: isRTL ? 'الثالث' : '3rd' },
    ];
    return badges[index] || null;
  };

  const parseImages = (imagesString: string): string[] => {
    try {
      return JSON.parse(imagesString);
    } catch {
      return [];
    }
  };

  return (
    <>
      <Header
        title={isRTL ? 'الأصناف الأكثر طلباً' : 'Popular Items Report'}
        description={isRTL ? 'تقرير بالأصناف الأكثر مبيعاً وإيراداً' : 'Report of best-selling and highest revenue items'}
      />

      <div className="p-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                  {isRTL ? 'إجمالي الأصناف' : 'Total Items'}
                </p>
                <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                  {reportData?.count || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                <Package size={24} className="text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                  {isRTL ? 'إجمالي الطلبات' : 'Total Orders'}
                </p>
                <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                  {popularItems.reduce((sum, item) => sum + item.totalOrdered, 0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-info-100 dark:bg-info-900/20 flex items-center justify-center">
                <ShoppingCart size={24} className="text-info-600 dark:text-info-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                  {isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}
                </p>
                <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                  L.S {popularItems.reduce((sum, item) => sum + parseFloat(item.totalRevenue), 0).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success-100 dark:bg-success-900/20 flex items-center justify-center">
                <DollarSign size={24} className="text-success-600 dark:text-success-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Loading State */}
        {status === 'loading' && (
          <Card>
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent mb-4"></div>
              <p className="text-secondary-600 dark:text-secondary-400">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {status === 'success' && popularItems.length === 0 && (
          <Card>
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center mb-4">
                <BarChart3 size={40} className="text-secondary-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                {isRTL ? 'لا توجد بيانات' : 'No data available'}
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                {isRTL ? 'لا توجد طلبات في الفترة المحددة' : 'No orders found for the selected period'}
              </p>
            </div>
          </Card>
        )}

        {/* Popular Items List */}
        {status === 'success' && popularItems.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                {isRTL ? 'الأصناف الأكثر طلباً' : 'Top Performing Items'}
              </h2>
              <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                <TrendingUp size={18} />
                <span>{isRTL ? 'مرتبة حسب عدد الطلبات' : 'Sorted by orders'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {popularItems.map((item, index) => {
                const images = parseImages(item.item.images);
                const topBadge = getTopBadge(index);

                return (
                  <Card
                    key={item.item.id}
                    className={clsx(
                      'transition-all duration-200 hover:shadow-xl',
                      index < 3 && 'border-2',
                      index === 0 && 'border-warning-300 dark:border-warning-700',
                      index === 1 && 'border-secondary-300 dark:border-secondary-600',
                      index === 2 && 'border-orange-300 dark:border-orange-700'
                    )}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <div className="flex items-center gap-6">
                      {/* Rank Badge */}
                      <div className="flex-shrink-0">
                        {topBadge ? (
                          <div className={clsx(
                            'w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white font-bold',
                            topBadge.bg
                          )}>
                            <span className="text-2xl">{topBadge.icon}</span>
                            <span className="text-xs mt-1">{topBadge.text}</span>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center">
                            <span className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                              #{index + 1}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Item Image */}
                      {images.length > 0 && (
                        <div className="flex-shrink-0">
                          <img
                            src={`${BASE_URL}${images[0]}`}
                            alt={item.item.name}
                            className="w-24 h-24 object-cover rounded-lg border-2 border-secondary-200 dark:border-secondary-700"
                          />
                        </div>
                      )}

                      {/* Item Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-secondary-900 dark:text-secondary-100 mb-1">
                          {isRTL ? item.item.nameAr : item.item.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400">
                            {isRTL ? item.item.category.nameAr : item.item.category.name}
                          </span>
                          <span className="text-sm text-secondary-600 dark:text-secondary-400">
                            L.S {item.item.price} {isRTL ? 'للوحدة' : 'per item'}
                          </span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex-shrink-0 grid grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-info-100 dark:bg-info-900/20 mx-auto mb-2">
                            <ShoppingCart size={20} className="text-info-600 dark:text-info-400" />
                          </div>
                          <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                            {item.totalOrdered}
                          </p>
                          <p className="text-xs text-secondary-600 dark:text-secondary-400">
                            {isRTL ? 'الكمية المباعة' : 'Units Sold'}
                          </p>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-success-100 dark:bg-success-900/20 mx-auto mb-2">
                            <DollarSign size={20} className="text-success-600 dark:text-success-400" />
                          </div>
                          <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                            L.S {parseFloat(item.totalRevenue).toFixed(2)}
                          </p>
                          <p className="text-xs text-secondary-600 dark:text-secondary-400">
                            {isRTL ? 'الإيرادات' : 'Revenue'}
                          </p>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-warning-100 dark:bg-warning-900/20 mx-auto mb-2">
                            <Award size={20} className="text-warning-600 dark:text-warning-400" />
                          </div>
                          <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                            {item.ordersCount}
                          </p>
                          <p className="text-xs text-secondary-600 dark:text-secondary-400">
                            {isRTL ? 'الطلبات' : 'Orders'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
