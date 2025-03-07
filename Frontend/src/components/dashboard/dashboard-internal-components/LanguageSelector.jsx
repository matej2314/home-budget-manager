import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import i18next from 'i18next';
import { useIsMobile } from '../../../hooks/useIsMobile';

export default function LanguageSwitch({ isHomepage }) {
    const [selectedLang, setSelectedLang] = useState(i18next.language);
    const { isMobile } = useIsMobile();

    const languages = [
        { value: 'en', icon: <Icon icon="flagpack:gb-ukm" width={20} height={20} /> },
        { value: 'pl', icon: <Icon icon="flagpack:pl" width={20} height={20} /> }
    ];

    const toggleLanguage = () => {
        const nextLang = selectedLang === 'en' ? 'pl' : 'en';
        setSelectedLang(nextLang);
        i18next.changeLanguage(nextLang);
    };

    useEffect(() => {
        i18next.changeLanguage(selectedLang);
    }, [selectedLang]);

    return (
        <div
            className={`relative w-24 h-8 flex items-center rounded-full shadow-lg overflow-hidden cursor-pointer ${isHomepage ? 'bg-slate-200/70' : 'bg-slate-400/30 border-2 border-slate-500/45 shadow-slate-400/50'}`}
            onClick={toggleLanguage}>

            <motion.div
                className={`absolute w-1/2 h-full ${isHomepage ? 'bg-slate-600 border-2 border-slate-400' : 'bg-customGray/55 border-2 border-slate-300'} rounded-full`}
                animate={{
                    x: selectedLang === 'en' ? 0 : '100%',
                }}
                transition={{
                    duration: 0.8,
                    x: {
                        type: 'tween',
                        ease: 'easeInOut',
                    },
                }}
            />
            {languages.map((lang, index) => (
                <div
                    key={lang.value}
                    className="relative w-1/2 flex justify-center items-center"
                >
                    <motion.div
                        animate={{
                            scale: selectedLang === lang.value ? [1, 1.2, 1.1] : 1,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {lang.icon}
                    </motion.div>
                </div>
            ))}
        </div>
    );
}
