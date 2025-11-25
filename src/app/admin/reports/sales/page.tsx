'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/organisms';
import { Card, Button } from '@/components/atoms';
import { reportService, SalesData } from '@/api/services/reportService';
import { useAsync } from '@/hooks/useAsync';
import {
  DollarSign,
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
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                  {isRTL ? 'إجمالي المبيعات' : 'Total Sales'}
                </p>
                <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                  ${parseFloat(totals.totalSales || '0').toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success-100 dark:bg-success-900/20 flex items-center justify-center">
                <DollarSign size={24} className="text-success-600 dark:text-success-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                  {isRTL ? 'إجمالي الجلسات' : 'Total Sessions'}
                </p>
                <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                  {totals.totalSessions}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-info-100 dark:bg-info-900/20 flex items-center justify-center">
                <Users size={24} className="text-info-600 dark:text-info-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                  {isRTL ? 'متوسط قيمة الجلسة' : 'Avg Session Value'}
                </p>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  ${isNaN(parseFloat(totals.avgSessionValue)) ? '0.00' : parseFloat(totals.avgSessionValue).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                <TrendingUp size={24} className="text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Buttons */}
        <Card className="mb-6">
          <div className="flex items-center justify-between" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-secondary-600 dark:text-secondary-400" />
              <span className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">
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
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent mb-4"></div>
              <p className="text-secondary-600 dark:text-secondary-400">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {status === 'success' && salesData.length === 0 && (
          <Card>
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center mb-4">
                <BarChart3 size={40} className="text-secondary-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                {isRTL ? 'لا توجد بيانات' : 'No data available'}
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
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
              <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-100">
                {isRTL ? 'بيانات المبيعات' : 'Sales Data'}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
                <thead className="bg-secondary-50 dark:bg-secondary-900/50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                      {isRTL ? 'التاريخ' : 'Date'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                      {isRTL ? 'المبيعات' : 'Sales'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                      {isRTL ? 'الجلسات' : 'Sessions'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                      {isRTL ? 'الطلبات' : 'Orders'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                      {isRTL ? 'متوسط الجلسة' : 'Avg/Session'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                  {salesData.map((data, index) => {
                    const avgPerSession = data.sessionsCount > 0
                      ? parseFloat(data.totalSales) / data.sessionsCount
                      : 0;

                    return (
                      <tr key={index} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-secondary-400" />
                            <span className="font-medium text-secondary-900 dark:text-secondary-100">
                              {formatDate(data.date)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-success-600 dark:text-success-400">
                              ${parseFloat(data.totalSales).toFixed(2)}
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
                            <span className="font-semibold text-secondary-900 dark:text-secondary-100">
                              {data.sessionsCount}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-secondary-900 dark:text-secondary-100">
                            {data.ordersCount || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-primary-600 dark:text-primary-400">
                            ${avgPerSession.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-secondary-100 dark:bg-secondary-900/70">
                  <tr>
                    <td className="px-6 py-4 font-bold text-secondary-900 dark:text-secondary-100">
                      {isRTL ? 'الإجمالي' : 'Total'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-success-600 dark:text-success-400">
                        ${parseFloat(totals.totalSales).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-secondary-900 dark:text-secondary-100">
                        {totals.totalSessions}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-secondary-900 dark:text-secondary-100">
                        {salesData.reduce((sum, data) => sum + (data.ordersCount || 0), 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary-600 dark:text-primary-400">
                        ${isNaN(parseFloat(totals.avgSessionValue)) ? '0.00' : parseFloat(totals.avgSessionValue).toFixed(2)}
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
