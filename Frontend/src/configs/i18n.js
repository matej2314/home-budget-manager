import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(Backend) // Załaduj tłumaczenia asynchronicznie
    .use(LanguageDetector) // Wykrywanie języka użytkownika
    .use(initReactI18next)
    .init({
        fallbackLng: 'en', // Domyślny język, jeśli nie wykryje odpowiedniego
        debug: false,
        interpolation: {
            escapeValue: false, // React już zapobiega XSS
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json', // Ścieżka do plików tłumaczeń
        },
        ns: ['common', "aboutUs", "dashboardComponents", "dashboardInternal", "errorPage", "forms", "pages", "homePage", "modals", "utils"], // Lista przestrzeni nazw
        defaultNS: 'common', // Domyślna przestrzeń nazw
        detection: {
            order: ['navigator', 'cookie', 'localStorage', 'sessionStorage', 'htmlTag'], // Źródła wykrywania języka
            caches: ['cookie', 'localStorage'] // Zapisywanie języka w pamięci przeglądarki
        },
    });

export default i18n;
