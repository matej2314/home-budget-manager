import LineChart from "../../../charts/LineChart"
import { useSortedUniqueData } from "../../../../hooks/useSortedUniqueData";
import { useTranslation } from 'react-i18next';

export default function BudgetPerDay({ data }) {
    const { uniqueLabels, uniqueDataValues } = useSortedUniqueData(data);
    const { t } = useTranslation("dashboardComponents");

    const splittedLabels = uniqueLabels.map((label) => label.slice(5));

    return (
        <div id="budget-per-day-chart" className="section-card w-full min-w-0 flex flex-col gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-ink">{t("budgetPerDay.heading")}</h2>
            <div className="w-full h-56 sm:h-72 md:h-80 min-w-0">
                <LineChart
                    labels={splittedLabels}
                    dataValues={uniqueDataValues}
                    title='Budget per day'
                    colors={["rgba(16, 185, 129, 0.45)"]}
                    borderColors={["rgba(16, 185, 129, 1)"]}
                />
            </div>
        </div>
    )
}
