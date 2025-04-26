import LineChart from "../../../charts/LineChart"
import { useTranslation } from 'react-i18next';

interface TransactionsOverTimeProps {
    data: {
        labels: string[];
        dataValues: number[];
    }
}

export default function TransactionsOverTime({ data }: TransactionsOverTimeProps) {
    const { t } = useTranslation("dashboardComponents");

    return (
        <div id="transactionsOverTime" className="w-fit h-fit flex flex-col flex-wrap justify-center items-center lg:mr-5 border-2 border-slate-300 flex-grow flex-shrink">
            <h2 className="w-full h-fit flex justify-center text-xl mb-3">{t("actionsOverTime.heading")}</h2>
            <div className="w-full h-full">
                <div className="w-full h-[25rem] indirect:w-[90vw] md:h-[35rem] md:w-[40rem] flex justify-center">
                    <LineChart
                        labels={data.labels}
                        dataValues={data.dataValues}
                        title='Transactions count'
                        colors={["rgba(54, 162, 235, 0.5)"]}
                        borderColors={["rgba(54, 162, 235, 1)"]}
                    />
                </div>

            </div>
        </div>
    )
}