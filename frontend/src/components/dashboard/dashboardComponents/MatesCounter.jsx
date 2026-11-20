import { useContext } from "react";
import { DataContext } from "../../../store/dataContext";
import { useTranslation } from 'react-i18next';
import { getData } from '../../../utils/getData';
import { Icon } from '@iconify/react';

export default function MatesCounter() {
    const { data, isLoading, dataError: error } = useContext(DataContext);
    const { t } = useTranslation("dashboardComponents");

    const matesData = getData(isLoading, error, true, data.inmates);

    return (
        <div id='housemates' className="metric-card">
            <div className="flex items-start justify-between gap-3">
                <h2 className="text-sm font-medium text-muted">{t("matesCounter.heading")}</h2>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-rose-500/10 text-rose-500">
                    <Icon icon='lucide:users-round' width={22} height={22} />
                </span>
            </div>
            {!isLoading && !error && (
                <span className="text-3xl font-semibold tracking-tight text-ink">{matesData.length}</span>
            )}
        </div>
    );
}
