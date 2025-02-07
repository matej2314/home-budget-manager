import LineChart from "../../../charts/LineChart"

export default function BudgetPerDay({ data }) {

    return (
        <div id="budget-per-day-chart" className="w-fit h-fit flex flex-col gap-4 border-2 border-slate-500/20 pt-2">
            <h2 className="w-full h-fit flex justify-center text-xl">Budget per day</h2>
            <LineChart
                labels={data.labels}
                dataValues={data.dataValues}
                title='Transactions per day'
                colors={["rgba(54, 162, 235, 0.5)"]}
                borderColors={["rgba(54, 162, 235, 1)"]}
                width={300}
                height={400}
            />
        </div>
    )
}