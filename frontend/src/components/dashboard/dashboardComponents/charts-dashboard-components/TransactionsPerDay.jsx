import LineChart from '../../../charts/LineChart';
import { useTranslation } from 'react-i18next';
import { useSortedUniqueData } from '../../../../hooks/useSortedUniqueData';

export default function TransactionsPerDay({ data }) {
    const { uniqueLabels, uniqueDataValues } = useSortedUniqueData(data);
    const { t } = useTranslation("dashboardComponents");

    return (
        <div id="transactions-per-day-chart" className="section-card w-full min-w-0 flex flex-col gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-ink">{t("actionsPerDay.heading")}</h2>
            <div className="w-full h-56 sm:h-72 md:h-80 min-w-0">
                <LineChart
                    labels={uniqueLabels}
                    dataValues={uniqueDataValues}
                    title='Transactions per day'
                    colors={["rgba(76, 111, 255, 0.45)"]}
                    borderColors={["rgba(76, 111, 255, 1)"]}
                />
            </div>
        </div>
    );
}
