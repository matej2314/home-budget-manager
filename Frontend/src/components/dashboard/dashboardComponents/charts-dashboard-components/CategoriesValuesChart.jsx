import BarChart from "../../../charts/BarChart";
import { useIsMobile } from '../../../../hooks/useIsMobile';

export default function CategoriesValuesChart({ labels, values }) {
    const isMobile = useIsMobile();

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
                height={isMobile ? 250 : 470}
            />
        </div>
    )
}