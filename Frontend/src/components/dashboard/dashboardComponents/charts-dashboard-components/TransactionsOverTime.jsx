import LineChart from "../../../charts/LineChart"
import { useIsMobile } from "../../../../hooks/useIsMobile"

export default function TransactionsOverTime({ data }) {
    const isMobile = useIsMobile();

    return (
        <div id="transactionsOverTime" className="w-fit h-fit flex flex-col flex-wrap justify-center items-center lg:mr-5 border-2 border-slate-300 flex-grow flex-shrink">
            <h2 className="w-full h-fit flex justify-center text-xl mb-3">Transactions over time: </h2>
            <div className="w-full h-full">
                <LineChart
                    labels={data.labels}
                    dataValues={data.dataValues}
                    title='Transactions count'
                    colors={["rgba(54, 162, 235, 0.5)"]}
                    borderColors={["rgba(54, 162, 235, 1)"]}
                    width={!isMobile ? 250 : 370}
                    height={!isMobile ? 250 : 280}
                />
            </div>
        </div>
    )
}