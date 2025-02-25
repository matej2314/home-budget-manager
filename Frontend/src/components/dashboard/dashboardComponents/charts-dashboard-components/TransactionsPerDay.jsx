import LineChart from '../../../charts/LineChart';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { useSortedUniqueData } from '../../../../hooks/useSortedUniqueData';

export default function TransactionsPerDay({ data }) {
    const isMobile = useIsMobile();
    const { uniqueLabels, uniqueDataValues } = useSortedUniqueData(data);

    return (
        <div id="transactions-per-day-chart" className="w-fit h-fit border-2 border-slate-500/20 pt-2 mb-3 flex flex-col mx-auto lg:mx-0 gap-4">
            <h2 className="w-full h-fit flex justify-center text-xl">Transactions per day</h2>
            <LineChart
                labels={uniqueLabels}
                dataValues={uniqueDataValues}
                title='Transactions per day'
                colors={["rgba(54, 162, 235, 0.5)"]}
                borderColors={["rgba(54, 162, 235, 1)"]}
                width={!isMobile ? 725 : 370}
                height={300}
            />
        </div>
    );
}
