'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/organisms';
import { Button, Card, Input } from '@/components/atoms';
import { Modal } from '@/components/molecules';
import { userService, User, CreateUserData } from '@/api/services/userService';
import { useNotification } from '@/hooks/useNotification';
import { useAsync } from '@/hooks/useAsync';
import {
  Edit2,
  Trash2,
  Plus,
  Search,
  Users,
  CheckCircle2,
  XCircle,
  Mail,
  UserCircle,
  ChefHat,
  UtensilsCrossed,
} from 'lucide-react';
import clsx from 'clsx';

export default function UsersPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { notify } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<CreateUserData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'kitchen'>('all');

  const { data: usersData, status, execute: refetchUsers } = useAsync(
    () => userService.getAllUsers(),
    true
  );

  const handleOpenModal = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        role: 'kitchen',
      });
    } else {
      setSelectedUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'kitchen',
      });
    }
    setIsModalOpen(true);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username?.trim()) newErrors.username = isRTL ? 'مطلوب' : 'Required';
    if (!formData.email?.trim()) newErrors.email = isRTL ? 'مطلوب' : 'Required';
    if (!selectedUser && !formData.password?.trim()) newErrors.password = isRTL ? 'مطلوب' : 'Required';
    if (formData.password && formData.password.length < 6) newErrors.password = isRTL ? 'يجب أن تكون 6 أحرف على الأقل' : 'Must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (selectedUser) {
        await userService.updateUser(selectedUser.id, {
          username: formData.username,
          email: formData.email,
          password: formData.password || undefined,
        });
        notify.success(isRTL ? 'تم تحديث المستخدم بنجاح' : 'User updated successfully');
      } else {
        await userService.createUser(formData as CreateUserData);
        notify.success(isRTL ? 'تم إنشاء المستخدم بنجاح' : 'User created successfully');
      }

      setIsModalOpen(false);
      setSelectedUser(null);
      await refetchUsers();
    } catch (error: any) {
      console.error('Submit error:', error);
      notify.error(error.response?.data?.message || (isRTL ? 'حدث خطأ' : 'An error occurred'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await userService.deleteUser(id);
      notify.success(isRTL ? 'تم حذف المستخدم بنجاح' : 'User deleted successfully');
      setDeleteConfirm(null);
      await refetchUsers();
    } catch (error) {
      console.error('Delete error:', error);
      notify.error(isRTL ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await userService.toggleUserStatus(id, !currentStatus);
      notify.success(isRTL ? 'تم تحديث الحالة بنجاح' : 'Status updated successfully');
      await refetchUsers();
    } catch (error) {
      console.error('Toggle error:', error);
      notify.error(isRTL ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const users = usersData?.data || [];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    // Only show kitchen users
    const isKitchen = user.role === 'kitchen';

    return matchesSearch && matchesRole && isKitchen;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'kitchen':
        return <ChefHat size={20} />;
      case 'waiter':
        return <UtensilsCrossed size={20} />;
      default:
        return <UserCircle size={20} />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'kitchen':
        return 'bg-warning-100 dark:bg-warning-900/20 text-warning-700 dark:text-warning-400 border-warning-200 dark:border-warning-800';
      case 'waiter':
        return 'bg-info-100 dark:bg-info-900/20 text-info-700 dark:text-info-400 border-info-200 dark:border-info-800';
      default:
        return 'bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300';
    }
  };

  return (
    <>
      <Header
        title={isRTL ? 'إدارة المطابخ' : 'Kitchen Management'}
        description={isRTL ? 'إدارة حسابات المطابخ' : 'Manage kitchen accounts'}
      />

      <div className="p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                {isRTL ? 'المطابخ' : 'Kitchens'}
              </h2>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                {filteredUsers.length} {isRTL ? 'مطبخ' : 'kitchen accounts'}
              </p>
            </div>
            <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
              <Plus size={20} />
              {isRTL ? 'إضافة مطبخ' : 'Add Kitchen'}
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="relative w-full">
              <Search size={20} className="absolute top-3 left-3 text-secondary-400" />
              <input
                type="text"
                placeholder={isRTL ? 'ابحث عن مطبخ...' : 'Search kitchens...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={clsx(
                  'w-full pl-10 pr-4 py-2 rounded-lg border-2',
                  'bg-white dark:bg-secondary-800',
                  'border-secondary-200 dark:border-secondary-700',
                  'text-secondary-900 dark:text-secondary-100',
                  'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                )}
              />
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
        {status === 'success' && filteredUsers.length === 0 && (
          <Card>
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center mb-4">
                <Users size={40} className="text-secondary-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                {searchTerm ? (isRTL ? 'لم يتم العثور على مطابخ' : 'No kitchens found') : (isRTL ? 'لا يوجد مطابخ' : 'No kitchens')}
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-6">
                {searchTerm ? (isRTL ? 'جرب معايير بحث مختلفة' : 'Try different search criteria') : (isRTL ? 'ابدأ بإضافة أول مطبخ' : 'Start by adding your first kitchen')}
              </p>
              {!searchTerm && (
                <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
                  <Plus size={18} />
                  {isRTL ? 'إضافة مطبخ' : 'Add Kitchen'}
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Users Table */}
        {status === 'success' && filteredUsers.length > 0 && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
                <thead className="bg-secondary-50 dark:bg-secondary-900/50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                      {isRTL ? 'المطبخ' : 'Kitchen'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                      {isRTL ? 'الحالة' : 'Status'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                      {isRTL ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-warning-100 dark:bg-warning-900/20 flex items-center justify-center">
                            <ChefHat size={24} className="text-warning-600 dark:text-warning-400" />
                          </div>
                          <div>
                            <div className="font-semibold text-secondary-900 dark:text-secondary-100">
                              {user.username}
                            </div>
                            <div className="text-sm text-secondary-600 dark:text-secondary-400 flex items-center gap-1">
                              <Mail size={14} />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={clsx(
                          'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold',
                          user.isActive
                            ? 'bg-success-100 dark:bg-success-900/20 text-success-700 dark:text-success-400'
                            : 'bg-danger-100 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400'
                        )}>
                          {user.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          <span>{user.isActive ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'معطل' : 'Inactive')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(user.id, user.isActive)}
                            className="flex items-center gap-1"
                          >
                            {user.isActive ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenModal(user)}
                            className="flex items-center gap-1"
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setDeleteConfirm(user.id)}
                            className="flex items-center gap-1"
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
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
          setErrors({});
        }}
        title={selectedUser ? (isRTL ? 'تعديل مطبخ' : 'Edit Kitchen') : (isRTL ? 'إضافة مطبخ' : 'Add Kitchen')}
        size="md"
        actions={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedUser(null);
                setErrors({});
              }}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={handleSubmit}>
              {isRTL ? 'حفظ' : 'Save'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
          <Input
            label={isRTL ? 'اسم المستخدم' : 'Username'}
            value={formData.username || ''}
            onChange={(e) => {
              setFormData({ ...formData, username: e.target.value });
              if (errors.username) setErrors({ ...errors, username: '' });
            }}
            error={errors.username}
          />

          <Input
            label={isRTL ? 'البريد الإلكتروني' : 'Email'}
            type="email"
            value={formData.email || ''}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: '' });
            }}
            error={errors.email}
          />

          <Input
            label={isRTL ? (selectedUser ? 'كلمة المرور (اتركها فارغة للإبقاء على الحالية)' : 'كلمة المرور') : (selectedUser ? 'Password (leave empty to keep current)' : 'Password')}
            type="password"
            value={formData.password || ''}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              if (errors.password) setErrors({ ...errors, password: '' });
            }}
            error={errors.password}
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title={isRTL ? 'تأكيد الحذف' : 'Confirm Delete'}
        size="sm"
        actions={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              {isRTL ? 'حذف' : 'Delete'}
            </Button>
          </div>
        }
      >
        <p className="text-secondary-700 dark:text-secondary-300">
          {isRTL ? 'هل أنت متأكد من حذف هذا المطبخ؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this kitchen? This action cannot be undone.'}
        </p>
      </Modal>
    </>
  );
}
