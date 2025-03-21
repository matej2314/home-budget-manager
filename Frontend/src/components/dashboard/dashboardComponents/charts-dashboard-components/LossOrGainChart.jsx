import { useContext } from 'react';
import { DataContext } from '../../../../store/dataContext';
import useProcessedData from '../../../../hooks/useProcessedData';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { useTranslation } from 'react-i18next';
import BarChart from '../../../charts/BarChart';
import { getData } from '../../../../utils/getData';

export default function LossOrGainChart() {
    const { data, isLoading, error } = useContext(DataContext);
    const { isMobile, isTablet } = useIsMobile();
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
            return `rgba(40, 70, 193, 0.5)`;
        });
    };

    const barColors = generateBarColors(monthlyBalances);

    return (
        <>
            {data && <div id="lossOrGain" className="w-full shadow shadow-slate-500 pt-2 mb-3 flex flex-col justify-start items-center gap-4 mt-3">
                <h2 className="w-full flex justify-center text-[1.22rem]">{t("lossOrGain.heading")}</h2>
                <div className="w-full h-[15rem] lg:h-[20rem] lg:w-[70em] flex justify-center">
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