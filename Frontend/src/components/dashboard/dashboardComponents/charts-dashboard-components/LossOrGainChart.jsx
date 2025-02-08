import { useMemo, useContext } from 'react';
import { DataContext } from '../../../../store/dataContext';
import BarChart from '../../../charts/BarChart';

export default function LossOrGainChart() {

    const { data, isLoading, error, refreshData } = useContext(DataContext);

    const { houseData, houseMates, statsData, dailyData } = data;

    const getData = (data, defaultValue) => (!isLoading && !error && data) || defaultValue;

    const statData = getData(statsData, []);

    const { monthlyBalances, monthlyBalancesLabels } = useMemo(() => {
        if (!statData || !statData.length) {
            return { monthlyBalances: [], monthlyBalancesLabels: [] };
        };

        return {
            monthlyBalancesLabels: statData.map(item => item.monthlyBalanceDate),
            monthlyBalances: statData.map(item => item.monthlyBalanceValue),
        }
    }, [statData]);

    const generateBarColors = (values) => {
        return values.map((value) => {
            if (value < 0) {
                return `rgba(239, 61, 48, 0.5)`;
            } else if (value > 0) {
                return `rgba(5, 169, 10, 0.5)`;
            }
            return `rgba(40, 70, 193, 0.5)`;
        });
    };

    const barColors = generateBarColors(monthlyBalances);

    return (
        <div id="lossOrGain" className="w-full h-full shadow shadow-slate-500 pt-2 mb-3 flex flex-col justify-start items-center gap-4 mt-3">
            <h2 className="w-full h-fit flex justify-center text-[1.22rem]">Loss or gain:</h2>
            <BarChart
                labels={monthlyBalancesLabels}
                dataValues={monthlyBalances}
                title={barColors === `rgba(5, 169, 10, 0.5)` ? 'loss' : 'gain'}
                colors={barColors}
                borderColors={barColors.map(color => color.replace('0.5', '0'))}
                width={1250}
                height={250}

            />
        </div>
    )
}