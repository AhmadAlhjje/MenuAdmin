'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { authService } from '@/api/services/authService';
import { useNotification } from '@/hooks/useNotification';
import { Button } from '@/components/atoms';
import { Input } from '@/components/atoms';
import { cookieUtils } from '@/utils/cookies';
import { LogIn, Mail, Lock } from 'lucide-react';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { notify } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = t('login.errors.emailRequired') || 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('login.errors.invalidEmail') || 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = t('login.errors.passwordRequired') || 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = t('login.errors.passwordTooShort') || 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login(formData.email, formData.password);

      if (response.success && response.data) {
        // Store token in cookies
        document.cookie = `authToken=${response.data.token}; path=/; max-age=${60 * 60 * 24 * 7}`;

        if (response.data.refreshToken) {
          document.cookie = `refreshToken=${response.data.refreshToken}; path=/; max-age=${60 * 60 * 24 * 30}`;
        }

        notify.success(t('login.welcomeMessage') || 'Welcome to your dashboard');

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        const errorMsg = response.message || t('login.invalidCredentials') || 'Invalid email or password';
        notify.error(errorMsg);
        setErrors({
          general: errorMsg,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('login.errors.networkError') || 'Network error occurred';
      notify.error(errorMessage);
      setErrors({
        general: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-3 rounded-lg shadow-lg dark:shadow-2xl dark:shadow-primary-500/30">
              <LogIn size={28} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-slate-100 mb-2">
            {t('login.title') || 'Menu Admin'}
          </h1>
          <p className="text-secondary-600 dark:text-slate-400">
            {t('login.subtitle') || 'Restaurant Management System'}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl dark:shadow-black/50 dark:border dark:border-slate-700 p-8">
          {errors.general && (
            <div className="mb-4 p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-700 rounded-lg">
              <p className="text-danger-600 dark:text-danger-400 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-900 dark:text-slate-100 mb-2">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  {t('login.email') || 'Email Address'}
                </div>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t('login.emailPlaceholder') || 'admin@example.com'}
                error={errors.email}
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-900 dark:text-slate-100 mb-2">
                <div className="flex items-center gap-2">
                  <Lock size={16} />
                  {t('login.password') || 'Password'}
                </div>
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t('login.passwordPlaceholder') || '••••••••'}
                error={errors.password}
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('login.loggingIn') || 'Logging in...'}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn size={18} />
                  {t('login.loginButton') || 'Login'}
                </div>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-secondary-600 dark:text-slate-400 mt-6">
          {t('login.footer') || '© 2024 Menu Admin. All rights reserved.'}
        </p>
      </div>
    </div>
  );
}
