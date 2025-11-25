'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/organisms';
import { Button, Card } from '@/components/atoms';
import { useNotification } from '@/hooks/useNotification';
import { useThemeStore } from '@/store/themeStore';
import { authService } from '@/api/services/authService';
import { Lock, Eye, EyeOff } from 'lucide-react';


export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { isDark, toggleTheme } = useThemeStore();
  const { notify } = useNotification();

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

  return (
    <>
      <Header title={t('settings.title')} description={t('settings.account')} />

      <div className="p-6 md:p-8 max-w-6xl mx-auto">


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
