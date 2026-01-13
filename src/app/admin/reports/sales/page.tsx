'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/organisms';
import { Card, Button } from '@/components/atoms';
import { reportService, SalesData } from '@/api/services/reportService';
import { useAsync } from '@/hooks/useAsync';
import {
  TrendingUp,
  Calendar,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import clsx from 'clsx';

export default function SalesReportPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');

  const { data: reportData, status, execute: refetchReport } = useAsync(
    () => reportService.getSalesReport({ groupBy }),
    true
  );

  const salesData = reportData?.data.salesData || [];
  const totals = reportData?.data.totals || {
    totalSales: '0.00',
    totalSessions: 0,
    avgSessionValue: 'NaN',
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return isRTL ? 'غير محدد' : 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getGrowthIndicator = (current: number, previous: number) => {
    if (!previous) return null;
    const growth = ((current - previous) / previous) * 100;
    const isPositive = growth > 0;

    return (
      <div className={clsx(
        'flex items-center gap-1 text-sm font-semibold',
        isPositive ? 'text-success-600' : 'text-danger-600'
      )}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span>{Math.abs(growth).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <>
      <Header
        title={isRTL ? 'تقارير المبيعات' : 'Sales Report'}
        description={isRTL ? 'تقرير مفصل بالمبيعات والجلسات' : 'Detailed sales and sessions report'}
      />

      <div className="p-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-success-500 dark:border-l-success-400 hover:shadow-soft-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1 font-medium">
                  {isRTL ? 'إجمالي المبيعات' : 'Total Sales'}
                </p>
                <p className="text-3xl font-bold text-success-600 dark:text-success-400 group-hover:scale-105 transition-transform">
                  ل.س {parseFloat(totals.totalSales || '0').toFixed(0)}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-success-50 to-success-100 dark:from-success-500/20 dark:to-success-600/20 flex items-center justify-center shadow-soft group-hover:shadow-glow-success transition-all">
                <span className="text-2xl font-bold text-success-600 dark:text-success-400">ل.س</span>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-info-500 dark:border-l-info-400 hover:shadow-soft-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1 font-medium">
                  {isRTL ? 'إجمالي الجلسات' : 'Total Sessions'}
                </p>
                <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-info-600 dark:group-hover:text-info-400 transition-colors">
                  {totals.totalSessions}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-info-50 to-info-100 dark:from-info-500/20 dark:to-info-600/20 flex items-center justify-center shadow-soft group-hover:shadow-glow-info transition-all">
                <Users size={24} className="text-info-600 dark:text-info-400" />
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-primary-500 dark:border-l-primary-400 hover:shadow-soft-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1 font-medium">
                  {isRTL ? 'متوسط قيمة الجلسة' : 'Avg Session Value'}
                </p>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 group-hover:scale-105 transition-transform">
                  ل.س {isNaN(parseFloat(totals.avgSessionValue)) ? '0.00' : parseFloat(totals.avgSessionValue).toFixed(0)}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-500/20 dark:to-primary-600/20 flex items-center justify-center shadow-soft group-hover:shadow-glow-primary transition-all">
                <TrendingUp size={24} className="text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Buttons */}
        <Card className="mb-6">
          <div className="flex items-center justify-between" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-text-secondary-light dark:text-text-secondary-dark" />
              <span className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                {isRTL ? 'تجميع البيانات حسب:' : 'Group by:'}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={groupBy === 'day' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  setGroupBy('day');
                  refetchReport();
                }}
              >
                {isRTL ? 'يومي' : 'Daily'}
              </Button>
              <Button
                variant={groupBy === 'week' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  setGroupBy('week');
                  refetchReport();
                }}
              >
                {isRTL ? 'أسبوعي' : 'Weekly'}
              </Button>
              <Button
                variant={groupBy === 'month' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  setGroupBy('month');
                  refetchReport();
                }}
              >
                {isRTL ? 'شهري' : 'Monthly'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {status === 'loading' && (
          <Card>
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-600 border-t-primary-500 dark:border-t-primary-400 mb-4 shadow-glow-primary"></div>
              <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {status === 'success' && salesData.length === 0 && (
          <Card>
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-border-light to-surface dark:from-surface-dark-hover dark:to-surface-dark flex items-center justify-center mb-4 shadow-soft">
                <BarChart3 size={40} className="text-text-muted-light dark:text-text-muted-dark" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                {isRTL ? 'لا توجد بيانات' : 'No data available'}
              </h3>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {isRTL ? 'لا توجد مبيعات في الفترة المحددة' : 'No sales found for the selected period'}
              </p>
            </div>
          </Card>
        )}

        {/* Sales Data Table */}
        {status === 'success' && salesData.length > 0 && (
          <Card className="overflow-hidden">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-primary-600 dark:text-primary-400" />
              <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                {isRTL ? 'بيانات المبيعات' : 'Sales Data'}
              </h3>
            </div>
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
                <thead className="bg-gradient-to-r from-background-light to-surface dark:from-surface-dark-hover dark:to-surface-dark">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider">
                      {isRTL ? 'التاريخ' : 'Date'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider">
                      {isRTL ? 'المبيعات' : 'Sales'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider">
                      {isRTL ? 'الجلسات' : 'Sessions'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider">
                      {isRTL ? 'متوسط الجلسة' : 'Avg/Session'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  {salesData.map((data, index) => {
                    const avgPerSession = data.sessionsCount > 0
                      ? parseFloat(data.totalSales) / data.sessionsCount
                      : 0;

                    return (
                      <tr key={index} className="hover:bg-background-light dark:hover:bg-surface-dark-hover transition-all duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-text-muted-light dark:text-text-muted-dark" />
                            <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                              {formatDate(data.date)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-success-600 dark:text-success-400">
                              ل.س {parseFloat(data.totalSales).toFixed(0)}
                            </span>
                            {index > 0 && getGrowthIndicator(
                              parseFloat(data.totalSales),
                              parseFloat(salesData[index - 1].totalSales)
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-info-600 dark:text-info-400" />
                            <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                              {data.sessionsCount}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-primary-600 dark:text-primary-400">
                            ل.س {avgPerSession.toFixed(0)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gradient-to-r from-background-light to-surface dark:from-surface-dark-hover dark:to-surface-dark border-t-2 border-primary-500 dark:border-primary-400">
                  <tr>
                    <td className="px-6 py-4 font-bold text-text-primary-light dark:text-text-primary-dark">
                      {isRTL ? 'الإجمالي' : 'Total'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-success-600 dark:text-success-400 drop-shadow-lg">
                        ل.س {parseFloat(totals.totalSales).toFixed(0)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-text-primary-light dark:text-text-primary-dark">
                        {totals.totalSessions}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary-600 dark:text-primary-400 drop-shadow-lg">
                        ل.س {isNaN(parseFloat(totals.avgSessionValue)) ? '0.00' : parseFloat(totals.avgSessionValue).toFixed(0)}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
