import { useContext } from 'react';
import { DataContext } from '../../../../store/dataContext';
import useProcessedData from '../../../../hooks/useProcessedData';
import { useTranslation } from 'react-i18next';
import BarChart from '../../../charts/BarChart';
import { getData } from '../../../../utils/getData';

export default function LossOrGainChart() {
    const { data, isLoading, dataError: error } = useContext(DataContext);
    const { t } = useTranslation("dashboardComponents");
    const { statsData } = data;

    const statData = getData(isLoading, error, true, statsData, []);

    const { monthlyBalances, monthlyBalancesLabels } = useProcessedData(statData, {
        monthlyBalancesLabels: 'monthlyBalanceDate',
        monthlyBalances: 'monthlyBalanceValue',
    });

    const generateBarColors = (values) => {
        return values.map((value) => {
            if (value < 0) {
                return `rgba(239, 61, 48, 0.5)`;
            } else if (value > 0) {
                return `rgba(5, 169, 10, 0.5)`;
            }
            return `rgba(76, 111, 255, 0.5)`;
        });
    };

    const barColors = generateBarColors(monthlyBalances);

    return (
        <>
            {data && <div id="lossOrGain" className="section-card flex flex-col gap-4">
                <h2 className="text-base sm:text-lg font-semibold text-ink">{t("lossOrGain.heading")}</h2>
                <div className="w-full h-56 sm:h-60 lg:h-[28rem] max-w-full flex justify-center">
                    <BarChart
                        labels={monthlyBalancesLabels}
                        dataValues={monthlyBalances}
                        title={barColors === `rgba(5, 169, 10, 0.5)` ? t("lossOrGain.loss") : t("lossOrGain.gain")}
                        colors={barColors}
                        borderColors={barColors.map(color => color.replace('0.5', '0'))}
                    />
                </div>
            </div>}
        </>

    )
}
