import MatesList from '../dashboard-internal-components/MatesList';
import { useTranslation } from 'react-i18next';

export default function DisplayMatesList() {
    const { t } = useTranslation("dashboardComponents");

    return (
        <div id="matesList" className="w-10/12 h-fit flex flex-col justify-center rounded-md shadow-sm shadow-slate-500 mt-4 ml-5 gap-3 pt-2 pb-4 px-2">
            <h2 className="w-full h-fit flex justify-center text-xl text-slate-700">{t("displayMatesList.heading")}</h2>
            <MatesList mode=""/>
        </div>
    );
}

