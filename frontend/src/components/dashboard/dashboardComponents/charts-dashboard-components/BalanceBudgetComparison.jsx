import BarChart from "../../../charts/BarChart"
import { useTranslation } from 'react-i18next';

export default function BalanceBudgetComparison({ data }) {
    const { t } = useTranslation("dashboardComponents");

    return (
        <div id="balanceBudgetcompare" className="section-card w-full min-w-0 flex flex-col gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-ink">{t("balanceBudgetCompare.heading")}</h2>
            <div className="w-full h-56 sm:h-60 md:h-80 flex justify-center min-w-0">
                <BarChart
                    labels={data.labels}
                    dataValues={data.dataValues}
                    secondDataValues={data.definedBudgets}
                    title="Monthly balance"
                    secondTitle="Defined budget"
                    colors={["rgba(76, 111, 255, 0.45)"]}
                    borderColors={["rgba(76, 111, 255, 1)"]}
                    secondColors={["rgba(244, 63, 94, 0.4)"]}
                    secondBorderColors={["rgba(244, 63, 94, 1)"]}
                />
            </div>
        </div>
    )

}
