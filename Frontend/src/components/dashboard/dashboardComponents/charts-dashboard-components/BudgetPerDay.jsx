import LineChart from "../../../charts/LineChart"
import { useIsMobile } from "../../../../hooks/useIsMobile"
import { useSortedUniqueData } from "../../../../hooks/useSortedUniqueData";

export default function BudgetPerDay({ data }) {
    const isMobile = useIsMobile();
    const { uniqueLabels, uniqueDataValues } = useSortedUniqueData(data);

    return (
        <div id="budget-per-day-chart" className="w-fit h-fit flex flex-col gap-4 border-2 border-slate-500/20 pt-2">
            <h2 className="w-full h-fit flex justify-center text-xl">Budget per day</h2>
            <LineChart
                labels={uniqueLabels}
                dataValues={uniqueDataValues}
                title='Transactions per day'
                colors={["rgba(54, 162, 235, 0.5)"]}
                borderColors={["rgba(54, 162, 235, 1)"]}
                width={!isMobile ? 555 : 367}
                height={!isMobile ? 420 : 250}
            />
        </div>
    )
}