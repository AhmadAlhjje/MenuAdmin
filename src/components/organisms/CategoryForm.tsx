'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Card } from '@/components/atoms';
import { Category } from '@/types';
import clsx from 'clsx';

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isLoading?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    nameAr: initialData?.nameAr || '',
    description: initialData?.description || '',
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('categories.required');
    }
    if (!formData.nameAr.trim()) {
      newErrors.nameAr = t('categories.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-1 gap-6">
          <Input
            label={t('categories.name')}
            placeholder="e.g., Main Courses"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            error={errors.name}
          />

          <Input
            label={t('categories.nameAr')}
            placeholder="مثال: الأطباق الرئيسية"
            value={formData.nameAr}
            onChange={(e) => {
              setFormData({ ...formData, nameAr: e.target.value });
              if (errors.nameAr) setErrors({ ...errors, nameAr: '' });
            }}
            error={errors.nameAr}
          />

          <Input
            label={t('categories.description')}
            placeholder="Category description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            as="textarea"
          />
        </div>

        <div className={clsx('flex gap-3', isRTL ? 'flex-row-reverse' : '')}>
          <Button type="submit" isLoading={isLoading}>
            {t('common.save')}
          </Button>
        </div>
      </form>
    </Card>
  );
};
