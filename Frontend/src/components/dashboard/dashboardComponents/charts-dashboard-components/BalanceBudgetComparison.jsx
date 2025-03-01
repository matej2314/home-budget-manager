import BarChart from "../../../charts/BarChart"
import { useIsMobile } from '../../../../hooks/useIsMobile';

export default function BalanceBudgetComparison({ data }) {
    const { isMobile } = useIsMobile();

    return (
        <div id="balanceBudgetcompare" className="max-w-screen-lg lg:w-1/2 h-fit flex flex-col justify-center items-start border-2 border-slate-300 pt-3 px-3 flex-grow flex-shrink">
            <h2 className="w-full h-fit flex justify-center text-xl mb-3">Monthly Balance vs Defined Budgets</h2>
            <BarChart
                labels={data.labels}
                dataValues={data.dataValues}
                secondDataValues={data.definedBudgets}
                title="Monthly Balance"
                secondTitle="Defined Budgets"
                colors={["rgba(54, 162, 235, 0.5)"]}
                borderColors={["rgba(54, 162, 235, 1)"]}
                secondColors={["rgba(255, 99, 132, 0.5)"]}
                secondBorderColors={["rgba(255, 99, 132, 1)"]}
                width={!isMobile ? 250 : 100}
                height={!isMobile ? 200 : 120}
            />
        </div>
    )

}