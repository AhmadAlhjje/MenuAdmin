'use client';

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
import { Edit2, Trash2, Plus } from 'lucide-react';

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
      refetch();
    } catch (error) {
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
      refetch();
    } catch (error) {
      notify.error(t('errors.serverError'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await categoryService.deleteCategory(id);
      notify.success(t('categories.deleteSuccess'));
      setDeleteConfirm(null);
      refetch();
    } catch (error) {
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

  return (
    <>
      <Header title={t('categories.title')} description={t('categories.list')} />

      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            {t('categories.list')}
          </h2>
          <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
            <Plus size={20} />
            {t('categories.add')}
          </Button>
        </div>

        {status === 'loading' && (
          <Card>
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
            </div>
          </Card>
        )}

        {status === 'success' && categories.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <p className="text-secondary-500">{t('categories.noCategories')}</p>
            </div>
          </Card>
        )}

        {status === 'success' && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                    {isRTL ? category.nameAr : category.name}
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-2">
                    {category.description}
                  </p>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenModal(category)}
                    className="flex-1"
                  >
                    <Edit2 size={16} />
                    {t('common.edit')}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteConfirm(category.id)}
                    className="flex-1"
                  >
                    <Trash2 size={16} />
                    {t('common.delete')}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {status === 'error' && (
          <Card>
            <div className="text-center py-12">
              <p className="text-danger-600">{t('errors.serverError')}</p>
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
        <p>{t('categories.deleteConfirm')}</p>
      </Modal>
    </>
  );
}
