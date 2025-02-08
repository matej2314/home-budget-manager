import BarChart from "../../../charts/BarChart"

export default function CategoriesValuesChart({ labels, values }) {


    return (
        <div className="w-full h-fit flex flex-col items-center justify-center gap-7">
            <h2 className="text-xl">Value for each category:</h2>
            <BarChart
                labels={labels}
                dataValues={values}
                title="Transaction Categories"
                colors={['rgba(255, 99, 132, 0.2)']}
                borderColors={['rgba(255, 99, 132, 1)']}
                width={500}
                height={450}
            />
        </div>
    )
}