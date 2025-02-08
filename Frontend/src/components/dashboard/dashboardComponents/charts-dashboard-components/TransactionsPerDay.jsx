import LineChart from '../../../charts/LineChart';

export default function TransactionsPerDay({ data }) {

    return (
        <div id="transactions-per-day-chart" className="w-fit h-fit border-2 border-slate-500/20 pt-2 mb-3 flex flex-col justify-start gap-4">
            <h2 className="w-full h-fit flex justify-center text-xl">Transactions per day</h2>
            <LineChart
                labels={data.labels}
                dataValues={data.dataValues}
                title='Transactions per day'
                colors={["rgba(54, 162, 235, 0.5)"]}
                borderColors={["rgba(54, 162, 235, 1)"]}
                width={750}
                height={300}

            />

        </div>
    )
}