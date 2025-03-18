import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        common: require('../public/locales/en/common.json'),
        aboutUs: require('../public/locales/en/aboutUs.json'),
        dashboardComponents: require('../public/locales/en/dashboardComponents.json'),
        dashboardInternal: require('../public/locales/en/dashboardInternal.json'),
        errorPage: require('../public/locales/en/errorPage.json'),
        forms: require('../public/locales/en/forms.json'),
        homePage: require('../public/locales/en/homePage.json'),
    },
    pl: {
        common: require('../public/locales/pl/common.json'),
        aboutUs: require('../public/locales/pl/aboutUs.json'),
        dashboardComponents: require('../public/locales/pl/dashboardComponents.json'),
        dashboardInternal: require('../public/locales/pl/dashboardInternal.json'),
        errorPage: require('../public/locales/pl/errorPage.json'),
        forms: require('../public/locales/pl/forms.json'),
        homePage: require('../public/locales/pl/homePage.json'),
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: false,
        interpolation: { escapeValue: false },
        ns: ['common', 'aboutUs', 'dashboardComponents', 'dashboardInternal', 'errorPage', 'forms', 'homePage'],
        defaultNS: 'common',
        detection: {
            order: ['navigator', 'cookie', 'localStorage'],
            caches: ['cookie', 'localStorage'],
        },
        preload: ['en', 'pl'],
    });

export default i18n;
