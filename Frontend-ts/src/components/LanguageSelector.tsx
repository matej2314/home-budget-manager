import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from 'framer-motion';
import Select from 'react-select';
import i18next from "i18next";
import { useDeviceType } from "@hooks/useDeviceType";
import { setLocalStorage } from "@utils/storageUtils";
import { type LanguageOption, LanguageSwitchProps } from "@models/LanguageSelectorTypes";
import { type SingleValue, StylesConfig } from "react-select";

export default function LanguageSwitch({ isHomePage }: LanguageSwitchProps) {
    const [selectedLang, setSelectedLang] = useState(i18next.language);
    const { isMobile } = useDeviceType();


    const languages: LanguageOption[] = [
        { value: 'en', icon: <Icon icon="flagpack:gb-ukm" width={!isMobile ? 20 : 18} height={!isMobile ? 20 : 18} /> },
        { value: 'pl', icon: <Icon icon="flagpack:pl" width={!isMobile ? 20 : 18} height={!isMobile ? 20 : 18} /> }
    ];

    const handleLangChange = (selectedOption: SingleValue<LanguageOption>) => {
        if (selectedOption) {
            const newLang = selectedOption.value;
            setSelectedLang(newLang);
            i18next.changeLanguage(newLang);
            setLocalStorage("i18nextLng", newLang);
        }
    };

    useEffect(() => {
        const storedLang = localStorage.getItem('i18nextLng');
        if (storedLang) {
            setSelectedLang(storedLang);
            i18next.changeLanguage(storedLang);
        } else {
            const browserLang = navigator.language.split('-')[0];
            setSelectedLang(browserLang);
            i18next.changeLanguage(browserLang);
        }
    }, []);

    useEffect(() => {
        const handleLanguageChange = (lng: string) => setSelectedLang(lng);

        i18next.on('languageChanged', handleLanguageChange);
        return () => {
            i18next.off('languageChanged', handleLanguageChange);
        };
    }, []);

   

    const customStyles: StylesConfig<LanguageOption> = {
        control: (base) => ({
            ...base,
            minHeight: '2rem',
            width: !isMobile ? '2.5rem' : '2.2rem',
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
            fontSize: !isMobile ? '1rem' : '0.7rem',
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

    return (
        <div className="relative w-full flex flex-col items-center">
            {isMobile ? (
                <Select
                    options={languages}
                    value={languages.find(lang => lang.value === selectedLang) || languages[0]}
                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                    onChange={handleLangChange}
                    isSearchable={false}
                    isMulti={false}
                    className="w-full"
                    styles={customStyles}
                    formatOptionLabel={(e) => (
                        <div className="flex">
                            {e.icon}
                        </div>
                    )}
                />
            ) : (
                <div
                    className={`relative md:w-24 md:h-8 flex flex-col md:flex-row items-center rounded-full shadow-lg overflow-hidden cursor-pointer ${isHomePage ? 'bg-slate-200/70' : 'bg-slate-400/30 border-2 border-slate-500/45 shadow-slate-400/50'}`}
                    onClick={() => handleLangChange(languages.find(lang => lang.value !== selectedLang) ?? null)}
                >
                    <motion.div
                        className={`absolute w-1/2 h-full ${isHomePage ? 'bg-slate-600 border-2 border-slate-400' : 'bg-customGray/55 border-2 border-slate-300'} rounded-full`}
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
    };
