import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { getLocalStorage } from '../utils/storageUtils';

const savedLanguage = getLocalStorage('i18nextLng');
const browserLanguage = navigator.language.split('-')[0];
const defaultLanguage = savedLanguage || browserLanguage || 'en';

i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: false,
        interpolation: { escapeValue: false },

        ns: ['common', 'aboutUs', 'dashboardComponents', 'dashboardInternal', 'errorPage', 'forms', 'homePage', 'pages', 'modals', 'utils'],
        defaultNS: 'common',

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },

        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },

        preload: ['en', 'pl'],
        lng: defaultLanguage,
    });

export default i18n;
