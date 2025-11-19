'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/organisms';
import { Button, Card, Input } from '@/components/atoms';
import { Modal } from '@/components/molecules';
import { tableService } from '@/api/services/tableService';
import { useNotification } from '@/hooks/useNotification';
import { useAsync } from '@/hooks/useAsync';
import { Table } from '@/types';
import { Edit2, Trash2, Plus, QrCode } from 'lucide-react';

export default function TablesPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { notify } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Table>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: tablesData, status, execute: refetchTables } = useAsync(
    () => tableService.getAllTables(100),
    true
  );

  const handleOpenModal = (table?: Table) => {
    if (table) {
      setSelectedTable(table);
      setFormData(table);
    } else {
      setSelectedTable(null);
      setFormData({
        tableNumber: '',
        capacity: 4,
        location: '',
      });
    }
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tableNumber?.trim()) newErrors.tableNumber = t('tables.required');
    if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = t('tables.capacityError');
    if (!formData.location?.trim()) newErrors.location = t('tables.required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (selectedTable) {
        await tableService.updateTable(selectedTable.id, formData);
        notify.success(t('tables.updateSuccess'));
      } else {
        await tableService.createTable(formData as Omit<Table, 'id' | 'qrCode' | 'isActive' | 'createdAt' | 'updatedAt'>);
        notify.success(t('tables.createSuccess'));
      }
      setIsModalOpen(false);
      setSelectedTable(null);
      refetchTables();
    } catch (error) {
      notify.error(t('errors.serverError'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await tableService.deleteTable(id);
      notify.success(t('tables.deleteSuccess'));
      setDeleteConfirm(null);
      refetchTables();
    } catch (error) {
      notify.error(t('errors.serverError'));
    }
  };

  const tables = tablesData?.data || [];

  return (
    <>
      <Header title={t('tables.title')} description={t('tables.list')} />

      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            {t('tables.list')}
          </h2>
          <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
            <Plus size={20} />
            {t('tables.add')}
          </Button>
        </div>

        {status === 'loading' && (
          <Card>
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
            </div>
          </Card>
        )}

        {status === 'success' && tables.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <p className="text-secondary-500">{t('tables.noTables')}</p>
            </div>
          </Card>
        )}

        {status === 'success' && tables.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table) => (
              <Card key={table.id} className="flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                    {table.tableNumber}
                  </h3>
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      <span className="font-medium">{t('tables.capacity')}:</span> {table.capacity} {t('common.guests')}
                    </p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      <span className="font-medium">{t('tables.location')}:</span> {table.location}
                    </p>
                  </div>

                  {/* QR Code placeholder */}
                  <div className="mt-4 p-3 bg-secondary-100 dark:bg-secondary-700 rounded-lg flex items-center justify-center gap-2">
                    <QrCode size={20} className="text-primary-600" />
                    <span className="text-xs text-secondary-600 dark:text-secondary-400">
                      QR Code: {table.qrCode}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenModal(table)}
                    className="flex-1"
                  >
                    <Edit2 size={16} />
                    {t('common.edit')}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteConfirm(table.id)}
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
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTable(null);
        }}
        title={selectedTable ? t('tables.edit') : t('tables.add')}
        size="md"
        actions={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedTable(null);
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
            label={t('tables.tableNumber')}
            placeholder="e.g., T1, Table 1"
            value={formData.tableNumber || ''}
            onChange={(e) => {
              setFormData({ ...formData, tableNumber: e.target.value });
              if (errors.tableNumber) setErrors({ ...errors, tableNumber: '' });
            }}
            error={errors.tableNumber}
          />

          <Input
            label={t('tables.capacity')}
            type="number"
            min="1"
            value={formData.capacity?.toString() || '4'}
            onChange={(e) => {
              setFormData({ ...formData, capacity: parseInt(e.target.value) || 4 });
              if (errors.capacity) setErrors({ ...errors, capacity: '' });
            }}
            error={errors.capacity}
          />

          <Input
            label={t('tables.location')}
            placeholder="e.g., Ground Floor, Near Window"
            value={formData.location || ''}
            onChange={(e) => {
              setFormData({ ...formData, location: e.target.value });
              if (errors.location) setErrors({ ...errors, location: '' });
            }}
            error={errors.location}
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
        <p>{t('tables.deleteConfirm')}</p>
      </Modal>
    </>
  );
}
