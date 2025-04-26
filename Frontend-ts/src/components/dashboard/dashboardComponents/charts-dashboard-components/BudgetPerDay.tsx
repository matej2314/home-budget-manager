import LineChart from "../../../charts/LineChart"
import { useSortedUniqueData } from "../../../../hooks/useSortedUniqueData";
import { useTranslation } from 'react-i18next';

interface BudgetPerDayProps {
    data: {
        labels: Date[];
        dataValues: number[];
    };
}

export default function BudgetPerDay({ data }: BudgetPerDayProps) {
    const { uniqueLabels, uniqueDataValues } = useSortedUniqueData(data);
    const { t } = useTranslation("dashboardComponents");

    const splittedLabels = uniqueLabels.map((label) => String(label).slice(5));

    return (
        <div id="budget-per-day-chart" className="w-fit h-fit flex flex-col gap-4 border-2 border-slate-500/20 pt-2">
            <h2 className="w-full h-fit flex justify-center text-xl">{t("budgetPerDay.heading")}</h2>
            <div className="w-full h-96 indirect:w-[88vw] md:h-[470px] md:w-[45vw] text-base">
                <LineChart
                    labels={splittedLabels}
                    dataValues={uniqueDataValues}
                    title='Budget per day'
                    colors={["rgba(54, 162, 235, 0.5)"]}
                    borderColors={["rgba(54, 162, 235, 1)"]}
                />
            </div>

        </div>
    )
}