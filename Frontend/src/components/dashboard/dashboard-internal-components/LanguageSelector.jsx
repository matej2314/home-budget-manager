import Select from "react-select";
import { Icon } from "@iconify/react";
import i18next from 'i18next';

const languages = [
    { value: "en", label: <><Icon icon="flagpack:gb-ukm" width={20} height={20} /></> },
    { value: "pl", label: <><Icon icon="flagpack:pl" width={20} height={20} /></> },
];

export default function LanguageSelector() {
    const handleLangChange = (selectedOption) => {

        if (selectedOption) {
            // i18next.changeLanguage(selectedOption.value);
        } else {
            console.error("No option selected");
        }
    };

    return (
        <Select
            options={languages}
            defaultValue={languages.find(lang => lang.value === i18next.language) || languages[0]}
            onChange={handleLangChange}
            isSearchable={false}
            className="w-fit text-slate-900 border-2 rounded-md shadow-sm shadow-slate-400"
        />
    );
}
