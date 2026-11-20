import { useTransactionsStore } from "../../../store/transactionsStore";
import BarChart from '../../charts/BarChart';
import CategoriesValuesChart from "./charts-dashboard-components/CategoriesValuesChart";
import { getCategoryPercentages } from "../../../utils/countingUtils/getCategoryPercentages";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useTranslation } from 'react-i18next';
import { getData } from '../../../utils/getData';

export default function TopCategoriesList({ main }) {
    const { actionsLoading, actionsData, isTransactionsFetched, actionsDataError: actionsError } = useTransactionsStore();
    const { isMobile } = useIsMobile();
    const { t } = useTranslation("dashboardComponents");

    const transactions = getData(actionsLoading, actionsError, isTransactionsFetched && Array.isArray(actionsData), actionsData, []);

    const categoryData = getCategoryPercentages(transactions);

    const groupedTransactions = transactions.reduce((acc, transaction) => {
        const { categoryName, type, value } = transaction;
        const numericValue = parseFloat(value);

        if (!acc[categoryName]) {
            acc[categoryName] = 0;
        }

        if (type === 'income') {
            acc[categoryName] += numericValue;
        } else if (type === 'expense') {
            acc[categoryName] -= numericValue;
        };

        acc[categoryName] = parseFloat(acc[categoryName].toFixed(2));

        return acc;
    }, {});

    return (
        <div className={`section-card flex flex-col xl:flex-row justify-around gap-6 ${main ? '' : ''}`}>
            <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-semibold text-ink mb-3">{t("topCategoriesList.heading")}</h2>
                <ul className="mb-4 flex flex-wrap justify-center gap-2">
                    {categoryData.labels.map((label, index) => (
                        <li
                            key={label}
                            className="text-xs sm:text-sm px-2.5 py-1 rounded-full bg-accent-soft text-accent"
                        >
                            {label} : {getCategoryPercentages(transactions).dataValues[index]} %
                        </li>
                    ))}
                </ul>
                <div className="w-full h-[15rem] lg:h-[28rem]">
                    <BarChart
                        labels={categoryData.labels}
                        dataValues={categoryData.dataValues}
                        title="Transaction Categories"
                        colors={['rgba(76, 111, 255, 0.25)']}
                        borderColors={['rgba(76, 111, 255, 1)']}
                        width={500}
                        height={isMobile ? 250 : 450}
                    />
                </div>

            </div>
            <div className="min-w-0 flex-1">
                <CategoriesValuesChart labels={Object.keys(groupedTransactions)} values={Object.values(groupedTransactions)} />
            </div>
        </div>
    );
}
