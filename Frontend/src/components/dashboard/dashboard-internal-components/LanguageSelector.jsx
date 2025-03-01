import { useState } from 'react';
import Select from "react-select";
import { Icon } from "@iconify/react";
import i18next from 'i18next';
import { motion } from 'framer-motion';
import { useIsMobile } from '../../../hooks/useIsMobile';

export default function LanguageSelector() {
    const [selectedLang, setSelectedLang] = useState(i18next.language);
    const [animateFlag, setAnimateFlag] = useState(false);
    const { isMobile } = useIsMobile();

    const languages = [
        { value: "en", label: <Icon icon="flagpack:gb-ukm" width={isMobile ? 14 : 20} height={isMobile ? 14 : 20} /> },
        { value: "pl", label: <Icon icon="flagpack:pl" width={isMobile ? 14 : 20} height={isMobile ? 14 : 20} /> },
    ];

    const handleLangChange = (selectedOption) => {
        if (selectedOption) {
            setSelectedLang(selectedOption.value);
            setAnimateFlag(true);

            setTimeout(() => {
                setAnimateFlag(false);
            }, 1000);

            // i18next.changeLanguage(selectedOption.value);
        }
    };

    const customStyles = {
        control: (base) => ({
            ...base,
            minHeight: isMobile ? '1rem' : '2rem', // Wysokość pola
            width: 'fit-content',
            padding: isMobile ? '0.1rem' : '0.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }),
        valueContainer: (base) => ({
            ...base,
            padding: 0,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center',
        }),
        indicatorsContainer: (base) => ({
            ...base,
            display: isMobile ? 'none' : 'flex',
        }),
        singleValue: (base) => ({
            ...base,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }),
        menuList: (base) => ({
            ...base,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }),
        option: (base, { isFocused, isSelected }) => ({
            ...base,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem 0.5rem',
            backgroundColor: isSelected ? '#e0e0e0' : isFocused ? '#f0f0f0' : 'transparent',
            borderRadius: '0.375rem',
        })
    };

    return (
        <Select
            options={languages}
            defaultValue={languages.find(lang => lang.value === selectedLang) || languages[0]}
            onChange={handleLangChange}
            isSearchable={false}
            className="w-fit h-fit flex justify-center items-center text-slate-900 md:border-2 rounded-md shadow-sm shadow-slate-400"
            components={isMobile ? { DropdownIndicator: () => null } : undefined}
            styles={customStyles}
            getOptionLabel={(e) => (
                <motion.div
                    className='mx-auto'
                    animate={{
                        scale: animateFlag && e.value === selectedLang ? 1.5 : 1,
                    }}
                    transition={{ duration: 1 }}
                >
                    {e.label}
                </motion.div>
            )}
        />
    );
}
