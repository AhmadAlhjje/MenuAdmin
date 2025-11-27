'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/organisms';
import { Button, Card, Input } from '@/components/atoms';
import { Modal } from '@/components/molecules';
import { tableService } from '@/api/services/tableService';
import { useNotification } from '@/hooks/useNotification';
import { useAsync } from '@/hooks/useAsync';
import { Table } from '@/types';
import { Edit2, Trash2, Plus, QrCode, Printer, Users, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import clsx from 'clsx';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
        await tableService.createTable(formData as Omit<Table, 'id' | 'restaurantId' | 'qrCode' | 'qrCodeImage' | 'status' | 'isActive' | 'createdAt' | 'updatedAt'>);
        notify.success(t('tables.createSuccess'));
      }
      setIsModalOpen(false);
      setSelectedTable(null);
      await refetchTables();
    } catch (error) {
      console.error('Create/Update error:', error);
      notify.error(t('errors.serverError'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await tableService.deleteTable(id);
      notify.success(t('tables.deleteSuccess'));
      setDeleteConfirm(null);
      await refetchTables();
    } catch (error) {
      console.error('Delete error:', error);
      notify.error(t('errors.serverError'));
    }
  };

  const handlePrintQR = (table: Table) => {
    const qrImageUrl = `${BASE_URL}${table.qrCodeImage}`;

    // Create print window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      notify.error('Please allow popups to print QR code');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${table.tableNumber}</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 20mm;
              }
            }
            body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            .container {
              text-align: center;
              max-width: 400px;
            }
            h1 {
              font-size: 32px;
              margin-bottom: 10px;
              color: #1a202c;
            }
            .info {
              font-size: 18px;
              color: #4a5568;
              margin-bottom: 30px;
            }
            img {
              max-width: 300px;
              height: auto;
              border: 2px solid #e2e8f0;
              padding: 20px;
              border-radius: 8px;
              background: white;
            }
            .footer {
              margin-top: 30px;
              font-size: 14px;
              color: #718096;
            }
            .qr-code-text {
              font-size: 12px;
              color: #a0aec0;
              margin-top: 10px;
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Table ${table.tableNumber}</h1>
            <div class="info">
              <p>Capacity: ${table.capacity} guests</p>
              <p>Location: ${table.location}</p>
            </div>
            <img src="${qrImageUrl}" alt="QR Code for Table ${table.tableNumber}" />
            <p class="qr-code-text">${table.qrCode}</p>
            <div class="footer">
              <p>Scan to view menu and place orders</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-success-600 bg-success-100 dark:bg-success-900/20';
      case 'occupied':
        return 'text-danger-600 bg-danger-100 dark:bg-danger-900/20';
      case 'reserved':
        return 'text-warning-600 bg-warning-100 dark:bg-warning-900/20';
      default:
        return 'text-secondary-600 bg-secondary-100 dark:bg-secondary-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle2 size={16} />;
      case 'occupied':
      case 'reserved':
        return <XCircle size={16} />;
      default:
        return null;
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tables.map((table) => (
              <Card key={table.id} className="flex flex-col hover:shadow-lg transition-shadow" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-secondary-900 dark:text-secondary-100">
                      {t('tables.table')} {table.tableNumber}
                    </h3>
                    <div className={clsx(
                      'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-2',
                      getStatusColor(table.status)
                    )}>
                      {getStatusIcon(table.status)}
                      <span className="capitalize">{table.status}</span>
                    </div>
                  </div>
                  <div className={clsx(
                    'w-2 h-2 rounded-full',
                    table.isActive ? 'bg-success-500' : 'bg-secondary-400'
                  )} />
                </div>

                {/* Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400">
                    <Users size={18} />
                    <span className="text-sm">
                      {table.capacity} {t('common.guests')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400">
                    <MapPin size={18} />
                    <span className="text-sm">{table.location}</span>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="mt-4 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                  <div className="flex items-center justify-center mb-3">
                    {table.qrCodeImage && (
                      <img
                        src={`${BASE_URL}${table.qrCodeImage}`}
                        alt={`QR Code for Table ${table.tableNumber}`}
                        className="w-32 h-32 object-contain bg-white p-2 rounded"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs text-secondary-500 dark:text-secondary-400">
                    <QrCode size={14} />
                    <span className="font-mono truncate">{table.qrCode}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePrintQR(table)}
                    className="flex items-center justify-center gap-1"
                    title="Print QR Code"
                  >
                    <Printer size={16} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenModal(table)}
                    className="flex items-center justify-center gap-1"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteConfirm(table.id)}
                    className="flex items-center justify-center gap-1"
                  >
                    <Trash2 size={16} />
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
          setErrors({});
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
                setErrors({});
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
            placeholder={isRTL ? 'مثال: 1، طاولة 1' : 'e.g., 1, Table 1'}
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
            placeholder={isRTL ? 'مثال: الطابق الأرضي، بجانب النافذة' : 'e.g., Ground Floor, Near Window'}
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
