import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Select from 'react-select';
import i18next from 'i18next';
import { useIsMobile } from '../hooks/useIsMobile';

export default function LanguageSwitch({ isHomepage }) {
    const [selectedLang, setSelectedLang] = useState(i18next.selectedLang);
    const { isMobile } = useIsMobile();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const languages = [
        { value: 'en', icon: <Icon icon="flagpack:gb-ukm" width={20} height={20} /> },
        { value: 'pl', icon: <Icon icon="flagpack:pl" width={20} height={20} /> }
    ];

    const customStyles = {
        control: (base) => ({
            ...base,
            minHeight: '2rem',
            width: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '0.3rem',
            borderColor: '#ccc',
            boxShadow: 'none',
            '&:hover': { borderColor: '#aaa' }
        }),
        valueContainer: (base) => ({
            ...base,
            padding: '0 5px',
            display: 'flex',
            alignItems: 'center',
        }),
        singleValue: (base) => ({
            ...base,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
        }),
        menu: (base) => ({
            ...base,
            zIndex: 10,
        }),
        option: (base, { isFocused, isSelected }) => ({
            ...base,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem 1rem',
            backgroundColor: isSelected ? '#ddd' : isFocused ? '#f0f0f0' : 'transparent',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease-in-out',
        }),
    };

    const handleLangChange = (selectedOption) => {
        if (selectedOption) {
            setSelectedLang(selectedOption.value);
            i18next.changeLanguage(selectedOption.value);
        }
    };

    useEffect(() => {
        i18next.changeLanguage(selectedLang);
    }, [selectedLang]);

    return (
        <div className="relative w-full flex flex-col items-center">
            {isMobile ? (
                <Select
                    options={languages}
                    value={languages.find(lang => lang.value === selectedLang) || 'en'}
                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                    onChange={handleLangChange}
                    isSearchable={false}
                    className="w-full"
                    styles={customStyles}
                    getOptionLabel={(e) => (
                        <div className="flex items-center gap-2">
                            {e.icon}
                        </div>
                    )}
                />
            ) : (
                <div
                    className={`relative md:w-24 md:h-8 flex flex-col md:flex-row items-center rounded-full shadow-lg overflow-hidden cursor-pointer ${isHomepage ? 'bg-slate-200/70' : 'bg-slate-400/30 border-2 border-slate-500/45 shadow-slate-400/50'}`}
                    onClick={() => handleLangChange(languages.find(lang => lang.value !== selectedLang))}
                >
                    <motion.div
                        className={`absolute w-1/2 h-full ${isHomepage ? 'bg-slate-600 border-2 border-slate-400' : 'bg-customGray/55 border-2 border-slate-300'} rounded-full`}
                        animate={{ x: selectedLang === 'en' ? 0 : '100%' }}
                        transition={{ duration: 0.15, ease: 'easeIn' }}
                    />
                    {languages.map((lang) => (
                        <div key={lang.value} className="relative w-1/2 flex justify-center items-center">
                            <motion.div
                                animate={{ scale: selectedLang === lang.value ? [1, 1.2, 1] : 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {lang.icon}
                            </motion.div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
