'use client';

import { useTranslation } from 'react-i18next';
import { Header } from '@/components/organisms';
import { Card } from '@/components/atoms';
import { BarChart3, UtensilsCrossed, Grid3x3, Armchair } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { t } = useTranslation();

  const dashboardCards = [
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
      title: t('common.settings'),
      icon: BarChart3,
      href: '/settings',
      color: 'warning',
    },
  ];

  return (
    <>
      <Header
        title={t('common.dashboard')}
        description="Welcome to your restaurant admin dashboard"
      />
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <div className="flex flex-col items-center justify-center text-center gap-4">
                    <div className="p-4 bg-primary-100 dark:bg-primary-900 rounded-lg">
                      <Icon size={32} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                      {card.title}
                    </h3>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
