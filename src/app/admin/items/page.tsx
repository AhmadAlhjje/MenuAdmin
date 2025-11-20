'use client';

import { useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/organisms';
import { Button, Card, Input } from '@/components/atoms';
import { Modal } from '@/components/molecules';
import { itemService } from '@/api/services/itemService';
import { categoryService } from '@/api/services/categoryService';
import { useNotification } from '@/hooks/useNotification';
import { useAsync } from '@/hooks/useAsync';
import { MenuItem, Category } from '@/types';
import {
  Edit2,
  Trash2,
  Plus,
  Search,
  X,
  Upload,
  Image as ImageIcon,
  Clock,
  DollarSign,
  Tag,
  CheckCircle2,
  XCircle,
  Filter,
  Layers
} from 'lucide-react';
import clsx from 'clsx';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const MAX_IMAGES = 5;

export default function ItemsPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { notify } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number>(0);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [imageToView, setImageToView] = useState<string | null>(null);

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
      setExistingImages(item.images || []);
      setImageFiles([]);
      setImagePreviews([]);
    } else {
      setSelectedItem(null);
      setFormData({
        name: '',
        nameAr: '',
        description: '',
        price: 0,
        categoryId: 0,
        images: [],
        preparationTime: 30,
        displayOrder: 0,
        isAvailable: true,
      });
      setExistingImages([]);
      setImageFiles([]);
      setImagePreviews([]);
    }
    setIsModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const totalImages = existingImages.length + imageFiles.length + files.length;
    if (totalImages > MAX_IMAGES) {
      notify.warning(t('items.maxImagesReached'));
      return;
    }

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter((file) => {
      if (!file.type.startsWith('image/')) {
        notify.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        notify.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setImageFiles([...imageFiles, ...validFiles]);

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleViewImage = (url: string) => {
    setImageToView(url);
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
      setIsUploading(true);

      if (selectedItem) {
        // Update existing item
        // If user removed some existing images OR added new images, we need to send the changes
        const hasRemovedImages = existingImages.length < (selectedItem.images?.length || 0);
        const hasNewImages = imageFiles.length > 0;
        const replaceImages = hasRemovedImages || hasNewImages;

        await itemService.updateItem(
          selectedItem.id,
          formData,
          imageFiles.length > 0 ? imageFiles : undefined,
          replaceImages,
          existingImages // Send existing images to keep
        );
        notify.success(t('items.updateSuccess'));
      } else {
        // Create new item
        await itemService.createItem(
          formData as Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>,
          imageFiles.length > 0 ? imageFiles : undefined
        );
        notify.success(t('items.createSuccess'));
      }

      setIsModalOpen(false);
      setSelectedItem(null);
      await refetchItems();
    } catch (error) {
      console.error('Submit error:', error);
      notify.error(t('errors.serverError'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await itemService.deleteItem(id);
      notify.success(t('items.deleteSuccess'));
      setDeleteConfirm(null);
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
      await refetchItems();
    } catch (error) {
      console.error('Toggle error:', error);
      notify.error(t('errors.serverError'));
    }
  };

  const items = itemsData?.data || [];
  const categories = categoriesData?.data || [];

  // Get category colors
  const getCategoryColor = (categoryId: number) => {
    const index = categories.findIndex((c) => c.id === categoryId);
    const colors = [
      'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800',
      'bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 border-success-200 dark:border-success-800',
      'bg-info-100 dark:bg-info-900/20 text-info-600 dark:text-info-400 border-info-200 dark:border-info-800',
      'bg-warning-100 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400 border-warning-200 dark:border-warning-800',
      'bg-danger-100 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400 border-danger-200 dark:border-danger-800',
      'bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400 border-secondary-200 dark:border-secondary-600',
    ];
    return colors[index % colors.length];
  };

  // Filter items based on search term and category
  const filteredItems = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    return items.filter((item) => {
      const itemName = item.name.toLowerCase();
      const itemNameAr = item.nameAr.toLowerCase();
      const itemDescription = (item.description || '').toLowerCase();
      const category = categories.find((c) => c.id === item.categoryId);
      const categoryName = category?.name.toLowerCase() || '';
      const categoryNameAr = category?.nameAr.toLowerCase() || '';

      const matchesSearch =
        itemName.includes(searchLower) ||
        itemNameAr.includes(searchLower) ||
        itemDescription.includes(searchLower) ||
        categoryName.includes(searchLower) ||
        categoryNameAr.includes(searchLower);

      const matchesCategory = selectedCategoryFilter === 0 || item.categoryId === selectedCategoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [items, categories, searchTerm, selectedCategoryFilter]);

  // No need to separate items anymore - showing status as tags

  return (
    <>
      <Header title={t('items.title')} description={t('items.list')} />

      <div className="p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                {t('items.list')}
              </h2>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                {filteredItems.length} {filteredItems.length === 1 ? t('items.item') : t('items.items')}
              </p>
            </div>
            <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
              <Plus size={20} />
              {t('items.add')}
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Search */}
            <div className="relative">
              <Search size={20} className="absolute top-3 left-3 text-secondary-400" />
              <input
                type="text"
                placeholder={isRTL ? 'ابحث عن صنف...' : 'Search items...'}
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

            {/* Category Filter */}
            <div className="relative">
              <Filter size={20} className="absolute top-3 left-3 text-secondary-400" />
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(parseInt(e.target.value))}
                className={clsx(
                  'w-full pl-10 pr-4 py-2 rounded-lg border-2',
                  'bg-white dark:bg-secondary-800',
                  'border-secondary-200 dark:border-secondary-700',
                  'text-secondary-900 dark:text-secondary-100',
                  'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
                  'transition-colors'
                )}
              >
                <option value={0}>{t('items.allCategories')}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {isRTL ? cat.nameAr : cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {status === 'loading' && (
          <Card>
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent mb-4"></div>
              <p className="text-secondary-600 dark:text-secondary-400">{t('common.loading')}...</p>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {status === 'success' && filteredItems.length === 0 && (
          <Card>
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center mb-4">
                <ImageIcon size={40} className="text-secondary-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                {searchTerm || selectedCategoryFilter ? t('items.noItemsFound') : t('items.noItems')}
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-6 text-center max-w-md">
                {searchTerm || selectedCategoryFilter
                  ? t('items.tryDifferentSearch')
                  : t('items.noItemsDescription')}
              </p>
              {!searchTerm && !selectedCategoryFilter && (
                <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
                  <Plus size={18} />
                  {t('items.addFirst')}
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* All Items with Status Tags */}
        {status === 'success' && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const category = categories.find((c) => c.id === item.categoryId);
              return (
                <Card
                  key={item.id}
                  className="flex flex-col hover:shadow-lg transition-all duration-200 group"
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  {/* Image Section */}
                  <div className="relative mb-4 rounded-lg overflow-hidden bg-secondary-100 dark:bg-secondary-800">
                    {item.images && item.images.length > 0 ? (
                      <>
                        <img
                          src={`${BASE_URL}${item.images[0]}`}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                        {item.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                            <ImageIcon size={12} />
                            <span>{item.images.length}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center">
                        <ImageIcon size={48} className="text-secondary-400" />
                      </div>
                    )}

                    {/* Status Tag - Top Left */}
                    <div className="absolute top-2 left-2">
                      <div className={clsx(
                        'px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md',
                        item.isAvailable
                          ? 'bg-success-500 text-white'
                          : 'bg-danger-500 text-white'
                      )}>
                        {item.isAvailable ? (
                          <>
                            <CheckCircle2 size={12} />
                            <span>{t('items.available')}</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={12} />
                            <span>{t('items.unavailable')}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-100 mb-2 line-clamp-1">
                      {isRTL ? item.nameAr : item.name}
                    </h3>

                    {/* Category Badge */}
                    {category && (
                      <div className={clsx(
                        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-3 border',
                        getCategoryColor(item.categoryId)
                      )}>
                        <Layers size={12} />
                        <span>{isRTL ? category.nameAr : category.name}</span>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2 mb-3">
                      {item.description || t('items.noDescription')}
                    </p>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center gap-1 text-sm text-secondary-600 dark:text-secondary-400">
                        <DollarSign size={16} className="text-success-600" />
                        <span className="font-semibold text-secondary-900 dark:text-secondary-100">
                          {item.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-secondary-600 dark:text-secondary-400">
                        <Clock size={16} className="text-info-600" />
                        <span>{item.preparationTime} {t('common.min')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleAvailability(item.id, item.isAvailable)}
                      className="flex items-center justify-center gap-1"
                      title={item.isAvailable ? t('items.markUnavailable') : t('items.markAvailable')}
                    >
                      {item.isAvailable ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenModal(item)}
                      className="flex items-center justify-center gap-1"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteConfirm(item.id)}
                      className="flex items-center justify-center gap-1"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <Card>
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-danger-100 dark:bg-danger-900/20 flex items-center justify-center mb-4">
                <ImageIcon size={40} className="text-danger-600" />
              </div>
              <h3 className="text-lg font-semibold text-danger-600 mb-2">
                {t('errors.serverError')}
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-6">
                {t('errors.tryAgain')}
              </p>
              <Button onClick={() => refetchItems()} variant="secondary">
                {t('common.retry')}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
          setErrors({});
          setExistingImages([]);
          setImageFiles([]);
          setImagePreviews([]);
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
                setErrors({});
                setExistingImages([]);
                setImageFiles([]);
                setImagePreviews([]);
              }}
              disabled={isUploading}
            >
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={isUploading}>
              {isUploading ? t('common.uploading') : t('common.save')}
            </Button>
          </div>
        }
      >
        <div className="space-y-5 max-h-[70vh] overflow-y-auto px-1 py-1" dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Basic Information Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 pb-2 border-b border-secondary-200 dark:border-secondary-700">
              {isRTL ? 'المعلومات الأساسية' : 'Basic Information'}
            </h3>

            <div className="grid grid-cols-2 gap-3">
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
            </div>

            <div>
              <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                {t('items.description')}
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                placeholder={isRTL ? 'وصف الصنف...' : 'Item description...'}
                className={clsx(
                  'w-full px-3 py-2 rounded-lg border-2 mt-1',
                  'bg-white dark:bg-secondary-800',
                  'border-secondary-200 dark:border-secondary-700',
                  'text-secondary-900 dark:text-secondary-100',
                  'text-sm',
                  'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
                  'resize-none'
                )}
              />
            </div>
          </div>

          {/* Price & Details Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 pb-2 border-b border-secondary-200 dark:border-secondary-700">
              {isRTL ? 'السعر والتفاصيل' : 'Price & Details'}
            </h3>

            <div className="grid grid-cols-3 gap-3">
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
                    'w-full px-3 py-2 rounded-lg border-2 mt-1 text-sm',
                    'bg-white dark:bg-secondary-800',
                    'border-secondary-200 dark:border-secondary-700',
                    'text-secondary-900 dark:text-secondary-100',
                    'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
                    errors.categoryId && 'border-danger-500'
                  )}
                >
                  <option value="">{t('items.selectCategory')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {isRTL ? cat.nameAr : cat.name}
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

              <Input
                label={`${t('items.preparationTime')} (${t('common.min')})`}
                type="number"
                min="0"
                value={formData.preparationTime?.toString() || '30'}
                onChange={(e) =>
                  setFormData({ ...formData, preparationTime: parseInt(e.target.value) || 30 })
                }
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 pb-2 border-b border-secondary-200 dark:border-secondary-700">
              {t('items.images')} ({existingImages.length + imageFiles.length}/{MAX_IMAGES})
            </h3>

            {/* Show existing images if editing */}
            {existingImages.length > 0 && (
              <div className="p-3 bg-info-50 dark:bg-info-900/10 border border-info-200 dark:border-info-800 rounded-lg">
                <p className="text-xs text-info-700 dark:text-info-400 mb-2 font-medium">
                  {isRTL ? 'الصور الحالية:' : 'Current images:'} {existingImages.length}
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {existingImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={`${BASE_URL}${url}`}
                        alt={`Current ${index + 1}`}
                        className="w-full h-16 object-cover rounded border-2 border-info-300 dark:border-info-700 cursor-pointer hover:border-info-500 transition-colors"
                        onClick={() => handleViewImage(`${BASE_URL}${url}`)}
                      />
                      <button
                        onClick={() => handleRemoveExistingImage(index)}
                        className="absolute -top-1.5 -right-1.5 bg-danger-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        type="button"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-info-600 dark:text-info-400 mt-2">
                  {isRTL ? '💡 انقر على الصورة لعرضها • انقر على ✕ لحذفها' : '💡 Click image to view • Click ✕ to delete'}
                </p>
              </div>
            )}

            {/* File Upload Input */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={imageFiles.length >= MAX_IMAGES}
              />
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={existingImages.length + imageFiles.length >= MAX_IMAGES}
                className="w-full flex items-center justify-center gap-2 text-sm"
                size="sm"
              >
                <Upload size={16} />
                {isRTL ? 'إضافة صور' : 'Add Images'}
              </Button>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1.5">
                {isRTL ? 'حد أقصى 5 صور - كل صورة بحد أقصى 5 ميجابايت' : 'Max 5 images - 5MB each'}
              </p>
            </div>

            {/* New Images Preview */}
            {imagePreviews.length > 0 && (
              <div className="p-3 bg-success-50 dark:bg-success-900/10 border border-success-200 dark:border-success-800 rounded-lg">
                <p className="text-xs text-success-700 dark:text-success-400 mb-2 font-medium">
                  {isRTL ? '✨ الصور الجديدة:' : '✨ New images:'}
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`New ${index + 1}`}
                        className="w-full h-16 object-cover rounded border-2 border-success-400 dark:border-success-600 cursor-pointer hover:border-success-600 dark:hover:border-success-400 transition-colors"
                        onClick={() => handleViewImage(preview)}
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-1.5 -right-1.5 bg-danger-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        type="button"
                      >
                        <X size={12} />
                      </button>
                      <div className="absolute top-1 left-1 bg-primary-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                        {t('common.new')}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-success-600 dark:text-success-400 mt-2">
                  {isRTL ? '💡 انقر على الصورة لعرضها • انقر على ✕ لحذفها' : '💡 Click image to view • Click ✕ to delete'}
                </p>
              </div>
            )}
          </div>
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
        <p className="text-secondary-700 dark:text-secondary-300">
          {t('items.deleteConfirm')}
        </p>
      </Modal>

      {/* Image Viewer Modal */}
      <Modal
        isOpen={imageToView !== null}
        onClose={() => setImageToView(null)}
        title={isRTL ? 'عرض الصورة' : 'View Image'}
        size="xl"
        actions={
          <Button variant="secondary" onClick={() => setImageToView(null)}>
            {t('common.close')}
          </Button>
        }
      >
        <div className="flex items-center justify-center bg-secondary-100 dark:bg-secondary-800 rounded-lg p-4">
          {imageToView && (
            <img
              src={imageToView}
              alt="Full view"
              className="max-w-full max-h-[70vh] object-contain rounded"
            />
          )}
        </div>
      </Modal>
    </>
  );
}
