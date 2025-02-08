import LineChart from "../../../charts/LineChart"

export default function TransactionsOverTime({ data }) {

    return (
        <div id="transactionsOverTime" className="w-fit h-fit flex flex-col flex-wrap justify-center items-center mr-5 border-2 border-slate-300 flex-grow flex-shrink">
            <h2 className="w-full h-fit flex justify-center text-xl mb-3">Transactions over time: </h2>
            <div className="w-full h-full">
                <LineChart
                    labels={data.labels}
                    dataValues={data.dataValues}
                    title='Transactions count'
                    colors={["rgba(54, 162, 235, 0.5)"]}
                    borderColors={["rgba(54, 162, 235, 1)"]}
                    width={470}
                    height={444}
                />
            </div>
        </div>
    )
}