import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: false,
        interpolation: { escapeValue: false },

        ns: ['common', 'aboutUs', 'dashboardComponents', 'dashboardInternal', 'errorPage', 'forms', 'homePage'],
        defaultNS: 'common',

        detection: {
            order: ['navigator', 'cookie', 'localStorage'],
            caches: ['cookie', 'localStorage'],
        },

        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },

        preload: ['en', 'pl'],
    });

export default i18n;
