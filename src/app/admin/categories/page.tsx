'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/organisms';
import { Button, Card } from '@/components/atoms';
import { Modal } from '@/components/molecules';
import { CategoryForm } from '@/components/organisms';
import { categoryService } from '@/api/services/categoryService';
import { useNotification } from '@/hooks/useNotification';
import { useAsync } from '@/hooks/useAsync';
import { Category } from '@/types';
import { Edit2, Trash2, Plus, Grid3x3, Layers } from 'lucide-react';
import clsx from 'clsx';

export default function CategoriesPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { notify } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const { data: categoriesData, status, execute: refetch } = useAsync(
    () => categoryService.getAllCategories(100),
    true
  );

  const handleCreate = async (formData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await categoryService.createCategory(formData);
      notify.success(t('categories.createSuccess'));
      setIsModalOpen(false);
      await refetch();
    } catch (error) {
      console.error('Create error:', error);
      notify.error(t('errors.serverError'));
    }
  };

  const handleUpdate = async (formData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedCategory) return;
    try {
      await categoryService.updateCategory(selectedCategory.id, formData);
      notify.success(t('categories.updateSuccess'));
      setIsModalOpen(false);
      setSelectedCategory(null);
      await refetch();
    } catch (error) {
      console.error('Update error:', error);
      notify.error(t('errors.serverError'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await categoryService.deleteCategory(id);
      notify.success(t('categories.deleteSuccess'));
      setDeleteConfirm(null);
      await refetch();
    } catch (error) {
      console.error('Delete error:', error);
      notify.error(t('errors.serverError'));
    }
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const categories = categoriesData?.data || [];

  // Get category colors based on index
  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
      'bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400',
      'bg-info-100 dark:bg-info-900/20 text-info-600 dark:text-info-400',
      'bg-warning-100 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400',
      'bg-danger-100 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400',
      'bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400',
    ];
    return colors[index % colors.length];
  };

  return (
    <>
      <Header title={t('categories.title')} description={t('categories.list')} />

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                {t('categories.list')}
              </h2>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                {categories.length} {categories.length === 1 ? t('categories.category') : t('categories.categories')}
              </p>
            </div>
            <Button onClick={() => handleOpenModal()} className="flex items-center gap-2 w-full sm:w-auto">
              <Plus size={20} />
              <span className="sm:inline">{t('categories.add')}</span>
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {status === 'loading' && (
          <Card>
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-primary-500 border-t-transparent mb-4"></div>
              <p className="text-secondary-600 dark:text-secondary-400">{t('common.loading')}...</p>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {status === 'success' && categories.length === 0 && (
          <Card>
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center mb-4">
                <Grid3x3 size={40} className="text-secondary-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                {t('categories.noCategories')}
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-6 text-center max-w-md">
                {t('categories.noCategoriesDescription')}
              </p>
              <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
                <Plus size={18} />
                {t('categories.addFirst')}
              </Button>
            </div>
          </Card>
        )}

        {/* Categories Grid */}
        {status === 'success' && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card
                key={category.id}
                className="flex flex-col hover:shadow-lg transition-all duration-200 group"
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                {/* Category Icon & Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={clsx(
                    'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110',
                    getCategoryColor(index)
                  )}>
                    <Layers size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-100 truncate">
                      {isRTL ? category.nameAr : category.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="flex-1 mb-4">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-3">
                    {category.description || t('categories.noDescription')}
                  </p>
                </div>

                {/* Alternative Name Badge */}
                {((isRTL && category.name) || (!isRTL && category.nameAr)) && (
                  <div className="mb-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-100 dark:bg-secondary-800 text-xs text-secondary-700 dark:text-secondary-300">
                      <span className="font-medium">{isRTL ? category.name : category.nameAr}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenModal(category)}
                    className="flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    <span>{t('common.edit')}</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteConfirm(category.id)}
                    className="flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    <span>{t('common.delete')}</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <Card>
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-danger-100 dark:bg-danger-900/20 flex items-center justify-center mb-4">
                <Grid3x3 size={40} className="text-danger-600" />
              </div>
              <h3 className="text-lg font-semibold text-danger-600 mb-2">
                {t('errors.serverError')}
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-6">
                {t('errors.tryAgain')}
              </p>
              <Button onClick={() => refetch()} variant="secondary">
                {t('common.retry')}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedCategory ? t('categories.edit') : t('categories.add')}
        size="md"
      >
        <CategoryForm
          initialData={selectedCategory || undefined}
          onSubmit={selectedCategory ? handleUpdate : handleCreate}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title={t('common.confirm')}
        size="sm"
        actions={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              {t('common.delete')}
            </Button>
          </div>
        }
      >
        <p className="text-secondary-700 dark:text-secondary-300">
          {t('categories.deleteConfirm')}
        </p>
      </Modal>
    </>
  );
}
