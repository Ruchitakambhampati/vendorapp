import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enCommon from '../../public/locales/en/common.json';
import hiCommon from '../../public/locales/hi/common.json';
import teCommon from '../../public/locales/te/common.json';

const resources = {
  en: {
    common: enCommon,
  },
  hi: {
    common: hiCommon,
  },
  te: {
    common: teCommon,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'hi', // Default language
    fallbackLng: 'en',
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
