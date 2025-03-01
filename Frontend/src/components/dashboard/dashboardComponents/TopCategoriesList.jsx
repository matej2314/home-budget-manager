import { useTransactionsStore } from "../../../store/transactionsStore";
import BarChart from '../../charts/BarChart';
import CategoriesValuesChart from "./charts-dashboard-components/CategoriesValuesChart";
import { getCategoryPercentages } from "../../../utils/countingUtils/getCategoryPercentages";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { getData } from '../../../utils/getData';

export default function TopCategoriesList({ main }) {
    const { actionsLoading, actionsData, isTransactionsFetched, actionsDataError: actionsError } = useTransactionsStore();
    const { isMobile } = useIsMobile();

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
        <div className={`w-full h-fit flex flex-col lg:flex-row justify-around shadow-md shadow-slate-500 ${main ? 'mt-4' : 'mt-0'} pb-8 gap-4 pt-5`}>
            <div>
                <h2 className="w-full h-fit flex justify-center text-xl mb-4">Top categories of transactions:</h2>
                <ul className="mb-4 flex justify-center">
                    {categoryData.labels.map((label, index) => (
                        <li key={label}>
                            {label} : {getCategoryPercentages(transactions).dataValues[index]} %
                        </li>
                    ))}
                </ul>
                <BarChart
                    labels={categoryData.labels}
                    dataValues={categoryData.dataValues}
                    title="Transaction Categories"
                    colors={['rgba(255, 99, 132, 0.2)']}
                    borderColors={['rgba(255, 99, 132, 1)']}
                    width={500}
                    height={isMobile ? 250 : 450}
                />
            </div>
            <div>
                <CategoriesValuesChart labels={Object.keys(groupedTransactions)} values={Object.values(groupedTransactions)} />
            </div>
        </div>
    );
}
