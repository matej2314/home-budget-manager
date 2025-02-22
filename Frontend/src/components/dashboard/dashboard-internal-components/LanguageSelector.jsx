import { useState } from 'react';
import Select from "react-select";
import { Icon } from "@iconify/react";
import i18next from 'i18next';
import { motion } from 'framer-motion';

const languages = [
    { value: "en", label: <><Icon icon="flagpack:gb-ukm" width={20} height={20} /></> },
    { value: "pl", label: <><Icon icon="flagpack:pl" width={20} height={20} /></> },
];

export default function LanguageSelector() {
    const [selectedLang, setSelectedLang] = useState(i18next.language);
    const [animateFlag, setAnimateFlag] = useState(false);

    const handleLangChange = (selectedOption) => {
        if (selectedOption) {
            setSelectedLang(selectedOption.value);
            setAnimateFlag(true);

            setTimeout(() => {
                setAnimateFlag(false);
            }, 1000);

            // i18next.changeLanguage(selectedOption.value);
        } else {
            console.error("No option selected");
        }
    };

    return (
        <Select
            options={languages}
            defaultValue={languages.find(lang => lang.value === selectedLang) || languages[0]}
            onChange={handleLangChange}
            isSearchable={false}
            className="w-fit text-slate-900 border-2 rounded-md shadow-sm shadow-slate-400"
            getOptionLabel={(e) => (
                <motion.div
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
