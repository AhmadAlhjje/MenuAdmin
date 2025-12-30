'use client';

import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/organisms';
import { Button, Card } from '@/components/atoms';
import { useNotification } from '@/hooks/useNotification';
import { useThemeStore } from '@/store/themeStore';
import { authService } from '@/api/services/authService';
import { restaurantService } from '@/api/services/restaurantService';
import { Lock, Eye, EyeOff, Upload, Image as ImageIcon, Trash2, Building2 } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';


const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { isDark, toggleTheme } = useThemeStore();
  const { notify } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Fetch current user data
  const { data: userData, execute: refetchUser } = useAsync(
    () => authService.getCurrentUser(),
    true
  );

  const restaurant = (userData?.data as any)?.restaurant;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!passwordForm.currentPassword) {
      notify.error(t('settings.currentPasswordRequired'));
      return;
    }
    if (!passwordForm.newPassword) {
      notify.error(t('settings.newPasswordRequired'));
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      notify.error(t('validation.passwordTooShort'));
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      notify.error(t('validation.passwordMismatch'));
      return;
    }

    setIsLoadingPassword(true);
    try {
      await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);

      notify.success(t('settings.changePasswordSuccess'));
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      notify.error(error.response?.data?.message);
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleLanguageToggle = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);

    // Update HTML attributes
    const htmlElement = document.documentElement;
    htmlElement.lang = newLang;
    htmlElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';

    notify.success(t('common.success'));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      notify.error(isRTL ? 'الرجاء اختيار صورة' : 'Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notify.error(isRTL ? 'حجم الصورة كبير جداً (الحد الأقصى 5 ميغابايت)' : 'Image size is too large (max 5MB)');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploadingLogo(true);
    try {
      if (restaurant?.logo) {
        await restaurantService.updateLogo(file);
        notify.success(isRTL ? 'تم تحديث الشعار بنجاح' : 'Logo updated successfully');
      } else {
        await restaurantService.uploadLogo(file);
        notify.success(isRTL ? 'تم رفع الشعار بنجاح' : 'Logo uploaded successfully');
      }
      await refetchUser();
      setLogoPreview(null);
    } catch (error: any) {
      notify.error(error.response?.data?.message || (isRTL ? 'حدث خطأ' : 'An error occurred'));
      setLogoPreview(null);
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteLogo = async () => {
    if (!window.confirm(isRTL ? 'هل أنت متأكد من حذف الشعار؟' : 'Are you sure you want to delete the logo?')) {
      return;
    }

    setIsUploadingLogo(true);
    try {
      await restaurantService.deleteLogo();
      notify.success(isRTL ? 'تم حذف الشعار بنجاح' : 'Logo deleted successfully');
      await refetchUser();
    } catch (error: any) {
      notify.error(error.response?.data?.message || (isRTL ? 'حدث خطأ' : 'An error occurred'));
    } finally {
      setIsUploadingLogo(false);
    }
  };

  return (
    <>
      <Header title={t('settings.title')} description={t('settings.account')} />

      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">

        {/* Restaurant Logo Settings */}
        <Card>
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-secondary-200 dark:border-secondary-700">
              <Building2 size={24} className="text-primary-500" />
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  {isRTL ? 'شعار المطعم' : 'Restaurant Logo'}
                </h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                  {isRTL ? 'إدارة شعار المطعم' : 'Manage your restaurant logo'}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Logo Preview */}
              <div className="flex-shrink-0">
                <div className="w-48 h-48 rounded-xl border-2 border-dashed border-secondary-300 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                  ) : restaurant?.logoUrl ? (
                    <img
                      src={`${BASE_URL}${restaurant.logoUrl}`}
                      alt="Restaurant Logo"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = restaurant.logo || '';
                      }}
                    />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon size={48} className="mx-auto text-secondary-400 dark:text-secondary-600 mb-2" />
                      <p className="text-xs text-secondary-500 dark:text-secondary-500">
                        {isRTL ? 'لا يوجد شعار' : 'No logo'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Logo Controls */}
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                    {isRTL ? 'معلومات الشعار' : 'Logo Information'}
                  </h4>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {isRTL
                      ? 'يُستخدم الشعار في أكواد QR للطاولات وفي واجهة المستخدم'
                      : 'Logo is used in table QR codes and user interface'}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-500 mt-2">
                    {isRTL
                      ? 'الحد الأقصى لحجم الملف: 5 ميغابايت. الصيغ المدعومة: JPG, PNG, WebP'
                      : 'Maximum file size: 5MB. Supported formats: JPG, PNG, WebP'}
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingLogo}
                    className="flex items-center gap-2"
                  >
                    <Upload size={18} />
                    {isUploadingLogo
                      ? (isRTL ? 'جاري الرفع...' : 'Uploading...')
                      : restaurant?.logo
                      ? (isRTL ? 'تحديث الشعار' : 'Update Logo')
                      : (isRTL ? 'رفع شعار' : 'Upload Logo')}
                  </Button>

                  {restaurant?.logo && (
                    <Button
                      variant="danger"
                      onClick={handleDeleteLogo}
                      disabled={isUploadingLogo}
                      className="flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      {isRTL ? 'حذف الشعار' : 'Delete Logo'}
                    </Button>
                  )}
                </div>

                {restaurant?.name && (
                  <div className="pt-4 border-t border-secondary-200 dark:border-secondary-700">
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      <span className="font-semibold">{isRTL ? 'اسم المطعم: ' : 'Restaurant Name: '}</span>
                      {restaurant.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Password Settings */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-secondary-200 dark:border-secondary-700">
              <Lock size={24} className="text-primary-500" />
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  {t('settings.changePassword')}
                </h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                  {t('settings.account')}
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                  {t('settings.currentPassword')}
                </label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 rounded-lg border-2 border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
                    placeholder={t('settings.currentPassword')}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                    className="absolute inset-y-0 right-3 flex items-center text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-100"
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                  {t('settings.newPassword')}
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 rounded-lg border-2 border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
                    placeholder={t('settings.newPassword')}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        new: !prev.new,
                      }))
                    }
                    className="absolute inset-y-0 right-3 flex items-center text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-100"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                  {t('settings.confirmPassword')}
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 rounded-lg border-2 border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
                    placeholder={t('settings.confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                    className="absolute inset-y-0 right-3 flex items-center text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-100"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoadingPassword}
                  className="flex items-center gap-2"
                >
                  <Lock size={18} />
                  {isLoadingPassword ? t('common.loading') : t('settings.changePassword')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    })
                  }
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </>
  );
}
