import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enLocale from './locales/en.json';
import arLocale from './locales/ar.json';

const resources = {
  en: { translation: enLocale },
  ar: { translation: arLocale },
};

i18n.use(initReactI18next).init({
  resources,
  lng: typeof window !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
