import LineChart from "../../../charts/LineChart"
import { useTranslation } from 'react-i18next';

export default function TransactionsOverTime({ data }) {
    const { t } = useTranslation("dashboardComponents");

    return (
        <div id="transactionsOverTime" className="section-card w-full min-w-0 flex flex-col gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-ink">{t("actionsOverTime.heading")}</h2>
            <div className="w-full h-56 sm:h-60 md:h-80 flex justify-center min-w-0">
                <LineChart
                    labels={data.labels}
                    dataValues={data.dataValues}
                    title='Transactions count'
                    colors={["rgba(76, 111, 255, 0.45)"]}
                    borderColors={["rgba(76, 111, 255, 1)"]}
                />
            </div>
        </div>
    )
}
