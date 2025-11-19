'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/organisms';
import { Button, Card, Input } from '@/components/atoms';
import { Modal } from '@/components/molecules';
import { itemService } from '@/api/services/itemService';
import { categoryService } from '@/api/services/categoryService';
import { useNotification } from '@/hooks/useNotification';
import { useAsync } from '@/hooks/useAsync';
import { MenuItem } from '@/types';
import { Edit2, Trash2, Plus, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import clsx from 'clsx';

export default function ItemsPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { notify } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'available' | 'unavailable'>('available');;

  const { data: itemsData, status, execute: refetchItems } = useAsync(
    () => itemService.getAllItems(100),
    true
  );

  const { data: categoriesData } = useAsync(
    () => categoryService.getAllCategories(100),
    true
  );

  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setSelectedItem(item);
      setFormData(item);
    } else {
      setSelectedItem(null);
      setFormData({
        name: '',
        nameAr: '',
        description: '',
        price: 0,
        categoryId: 0,
        image: '',
        preparationTime: 30,
        displayOrder: 0,
        isAvailable: true,
      });
    }
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = t('items.required');
    if (!formData.nameAr?.trim()) newErrors.nameAr = t('items.required');
    if (!formData.categoryId) newErrors.categoryId = t('items.selectCategory');
    if (!formData.price || formData.price <= 0) newErrors.price = t('items.required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (selectedItem) {
        await itemService.updateItem(selectedItem.id, formData);
        notify.success(t('items.updateSuccess'));
      } else {
        await itemService.createItem(formData as Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>);
        notify.success(t('items.createSuccess'));
      }
      setIsModalOpen(false);
      setSelectedItem(null);
      refetchItems();
    } catch (error) {
      notify.error(t('errors.serverError'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await itemService.deleteItem(id);
      notify.success(t('items.deleteSuccess'));
      setDeleteConfirm(null);
      // Refetch items list after successful deletion
      await refetchItems();
    } catch (error) {
      console.error('Delete error:', error);
      notify.error(t('errors.serverError'));
    }
  };

  const handleToggleAvailability = async (id: number, currentStatus: boolean) => {
    try {
      await itemService.toggleAvailability(id, !currentStatus);
      notify.success(t('notifications.updated'));
      refetchItems();
    } catch (error) {
      notify.error(t('errors.serverError'));
    }
  };

  const items = itemsData?.data || [];
  const categories = categoriesData?.data || [];

  // Filter items based on search term and availability tab
  const filteredItems = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    const allFiltered = items.filter((item) => {
      const itemName = item.name.toLowerCase();
      const itemNameAr = item.nameAr.toLowerCase();
      const categoryName = categories.find((c) => c.id === item.categoryId)?.name.toLowerCase() || '';
      const categoryNameAr = categories.find((c) => c.id === item.categoryId)?.nameAr.toLowerCase() || '';

      const matchesSearch =
        itemName.includes(searchLower) ||
        itemNameAr.includes(searchLower) ||
        categoryName.includes(searchLower) ||
        categoryNameAr.includes(searchLower);

      return matchesSearch;
    });

    // Split by availability
    const available = allFiltered.filter((item) => item.isAvailable);
    const unavailable = allFiltered.filter((item) => !item.isAvailable);

    return { available, unavailable };
  }, [items, categories, searchTerm]);

  const displayItems = activeTab === 'available' ? filteredItems.available : filteredItems.unavailable;

  const renderItemsTable = (itemsList: MenuItem[]) => (
    <>
      {itemsList.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <p className="text-secondary-500">
              {searchTerm ? t('items.noItems') : t('items.noItems')}
            </p>
          </div>
        </Card>
      )}

      {itemsList.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-secondary-200 dark:border-secondary-700">
                <th className="text-left py-3 px-4 font-semibold text-secondary-900 dark:text-secondary-100">
                  {t('items.name')}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-secondary-900 dark:text-secondary-100">
                  {t('items.category')}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-secondary-900 dark:text-secondary-100">
                  {t('items.price')}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-secondary-900 dark:text-secondary-100">
                  {t('items.preparationTime')}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-secondary-900 dark:text-secondary-100">
                  {t('items.available')}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-secondary-900 dark:text-secondary-100">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {itemsList.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800"
                >
                  <td className="py-4 px-4">
                    <span className="text-secondary-900 dark:text-secondary-100">
                      {isRTL ? item.nameAr : item.name}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-secondary-600 dark:text-secondary-400">
                      {categories.find((c) => c.id === item.categoryId)?.name}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-secondary-900 dark:text-secondary-100">
                      {item.price}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-secondary-600 dark:text-secondary-400">
                      {item.preparationTime} min
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleAvailability(item.id, item.isAvailable)}
                      className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded transition-colors"
                    >
                      {item.isAvailable ? (
                        <ToggleRight className="text-success-600" size={20} />
                      ) : (
                        <ToggleLeft className="text-secondary-400" size={20} />
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenModal(item)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteConfirm(item.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  return (
    <>
      <Header title={t('items.title')} description={t('items.list')} />

      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            {t('items.list')}
          </h2>
          <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
            <Plus size={20} />
            {t('items.add')}
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="relative">
            <Search size={20} className="absolute top-3 left-3 text-secondary-400" />
            <input
              type="text"
              placeholder={isRTL ? 'ابحث عن صنف أو فئة...' : 'Search items or categories...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={clsx(
                'w-full pl-10 pr-4 py-2 rounded-lg border-2',
                'bg-white dark:bg-secondary-800',
                'border-secondary-200 dark:border-secondary-700',
                'text-secondary-900 dark:text-secondary-100',
                'placeholder-secondary-400 dark:placeholder-secondary-600',
                'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
                'transition-colors'
              )}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-secondary-200 dark:border-secondary-700">
          <button
            onClick={() => setActiveTab('available')}
            className={clsx(
              'px-4 py-3 font-medium text-sm transition-colors relative',
              activeTab === 'available'
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-200',
              activeTab === 'available' && 'border-b-2 border-primary-600 dark:border-primary-400'
            )}
          >
            {t('table.status.available')} ({filteredItems.available.length})
          </button>
          <button
            onClick={() => setActiveTab('unavailable')}
            className={clsx(
              'px-4 py-3 font-medium text-sm transition-colors relative',
              activeTab === 'unavailable'
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-200',
              activeTab === 'unavailable' && 'border-b-2 border-primary-600 dark:border-primary-400'
            )}
          >
            {t('table.status.unavailable')} ({filteredItems.unavailable.length})
          </button>
        </div>

        {status === 'loading' && (
          <Card>
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
            </div>
          </Card>
        )}

        {status === 'success' && items.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <p className="text-secondary-500">{t('items.noItems')}</p>
            </div>
          </Card>
        )}

        {status === 'success' && items.length > 0 && renderItemsTable(displayItems)}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? t('items.edit') : t('items.add')}
        size="lg"
        actions={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedItem(null);
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSubmit}>{t('common.save')}</Button>
          </div>
        }
      >
        <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
          <Input
            label={t('items.name')}
            value={formData.name || ''}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            error={errors.name}
          />

          <Input
            label={t('items.nameAr')}
            value={formData.nameAr || ''}
            onChange={(e) => {
              setFormData({ ...formData, nameAr: e.target.value });
              if (errors.nameAr) setErrors({ ...errors, nameAr: '' });
            }}
            error={errors.nameAr}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                {t('items.category')}
              </label>
              <select
                value={formData.categoryId || ''}
                onChange={(e) => {
                  setFormData({ ...formData, categoryId: parseInt(e.target.value) });
                  if (errors.categoryId) setErrors({ ...errors, categoryId: '' });
                }}
                className={clsx(
                  'w-full px-4 py-2 rounded-lg border-2 mt-1',
                  'bg-white dark:bg-secondary-800',
                  'border-secondary-200 dark:border-secondary-700',
                  errors.categoryId && 'border-danger-500'
                )}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-xs text-danger-500 mt-1">{errors.categoryId}</p>}
            </div>

            <Input
              label={t('items.price')}
              type="number"
              step="0.01"
              min="0"
              value={formData.price?.toString() || '0'}
              onChange={(e) => {
                setFormData({ ...formData, price: parseFloat(e.target.value) || 0 });
                if (errors.price) setErrors({ ...errors, price: '' });
              }}
              error={errors.price}
            />
          </div>

          <Input
            label={t('items.image')}
            placeholder="https://example.com/image.jpg"
            value={formData.image || ''}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />

          <Input
            label={t('items.preparationTime')}
            type="number"
            min="0"
            value={formData.preparationTime?.toString() || '30'}
            onChange={(e) =>
              setFormData({ ...formData, preparationTime: parseInt(e.target.value) || 30 })
            }
          />
        </div>
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
        <p>{t('items.deleteConfirm')}</p>
      </Modal>
    </>
  );
}
