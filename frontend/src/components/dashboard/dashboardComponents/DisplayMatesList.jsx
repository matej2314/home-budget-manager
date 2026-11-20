import MatesList from "../dashboard-internal-components/MatesList";
import { useTranslation } from 'react-i18next';

export default function DisplayMatesList() {
    const { t } = useTranslation("dashboardComponents");

    return (
        <div id="matesList" className="section-card flex flex-col gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-ink">{t("displayMatesList.heading")}</h2>
            <MatesList />
        </div>
    );
}
