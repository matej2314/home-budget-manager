import { useTranslation } from 'react-i18next';

export default function BasicHouseInfo({ basicHouseInfo }) {
    const { t } = useTranslation("dashboardInternal");
    const keysToDisplay = ['houseName', 'host', 'lastBalanceDate'];

    return (
        <div id="basicHouseInfo" className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {keysToDisplay.map((key) => (
                <div key={key} className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs text-muted font-medium">
                        {t(`basicHouseInfo.keysArray.${key}`)}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-ink truncate">
                        {basicHouseInfo[key] || t("basicHouseInfo.noData")}
                    </span>
                </div>
            ))}
        </div>
    );
}
