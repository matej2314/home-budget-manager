import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import i18next from 'i18next';
import { setLocalStorage } from '../utils/storageUtils';

function normalizeLang(lng) {
    if (!lng) return 'en';
    const base = String(lng).split('-')[0].toLowerCase();
    return base === 'pl' ? 'pl' : 'en';
}

function resolveInitialLang() {
    const storedLang = localStorage.getItem('i18nextLng');
    if (storedLang) {
        const normalized = normalizeLang(storedLang);
        i18next.changeLanguage(normalized);
        return normalized;
    }
    const browserLang = normalizeLang(navigator.language);
    i18next.changeLanguage(browserLang);
    return browserLang;
}

const languages = [
    { value: 'en', label: 'EN', flag: 'flagpack:gb-ukm' },
    { value: 'pl', label: 'PL', flag: 'flagpack:pl' },
];

export default function LanguageSwitch({ isHomepage = false }) {
    const [selectedLang, setSelectedLang] = useState(resolveInitialLang);

    const handleLangChange = (newLang) => {
        const normalized = normalizeLang(newLang);
        if (normalized === selectedLang) return;
        setSelectedLang(normalized);
        i18next.changeLanguage(normalized);
        setLocalStorage('i18nextLng', normalized);
    };

    useEffect(() => {
        const handleLanguageChange = (lng) => setSelectedLang(normalizeLang(lng));
        i18next.on('languageChanged', handleLanguageChange);
        return () => {
            i18next.off('languageChanged', handleLanguageChange);
        };
    }, []);

    const shellClass = isHomepage
        ? 'bg-white/10 border-white/20 text-slate-200'
        : 'bg-page border-slate-200 text-ink';

    const thumbClass = isHomepage
        ? 'bg-white/90 shadow-sm'
        : 'bg-surface shadow-sm border border-slate-200/80';

    const activeIdx = selectedLang === 'pl' ? 1 : 0;

    return (
        <div
            role="group"
            aria-label="Language"
            className={`relative inline-grid grid-cols-2 items-center rounded-lg border p-0.5 h-8 w-[5.25rem] shrink-0 ${shellClass}`}
        >
            <motion.span
                aria-hidden
                className={`absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-md ${thumbClass}`}
                animate={{ x: activeIdx * 100 + '%' }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            />
            {languages.map((lang) => {
                const active = selectedLang === lang.value;
                return (
                    <button
                        key={lang.value}
                        type="button"
                        onClick={() => handleLangChange(lang.value)}
                        aria-pressed={active}
                        title={lang.label}
                        className={`relative z-[1] h-full flex items-center justify-center gap-1 rounded-md text-[0.7rem] font-semibold tracking-wide transition-colors ${
                            active
                                ? isHomepage
                                    ? 'text-ink'
                                    : 'text-accent'
                                : isHomepage
                                    ? 'text-slate-300/80 hover:text-white'
                                    : 'text-muted hover:text-ink'
                        }`}
                    >
                        <Icon icon={lang.flag} width={14} height={14} className="rounded-[2px]" />
                        <span>{lang.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
