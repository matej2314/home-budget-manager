import { useTransactionsStore } from "../../../store/transactionsStore";
import BarChart from '../../charts/BarChart';
import CategoriesValuesChart from "./charts-dashboard-components/CategoriesValuesChart";
import { getCategoryPercentages } from "../../../utils/countingUtils/getCategoryPercentages";

export default function TopCategoriesList({ main }) {
    const { actionsLoading, actionsData, isTransactionsFetched, actionsDataError: actionsError } = useTransactionsStore();

    const transactions = !actionsLoading && !actionsError && isTransactionsFetched && Array.isArray(actionsData) ? actionsData : [];

    const { labels, dataValues } = getCategoryPercentages(transactions);

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
        <div className={`w-full h-fit flex flex-row justify-around shadow-md shadow-slate-500 ${main ? 'mt-4' : 'mt-0'} pb-8 gap-4 pt-5`}>
            <div>
                <h2 className="text-xl mb-4">Top categories of transactions:</h2>
                <ul className="mb-4">
                    {categoryPercentages.map((cat) => (
                        <li key={cat.label}>
                            {cat.label} : {cat.value} %
                        </li>
                    ))}
                </ul>
                <BarChart
                    labels={labels}
                    dataValues={dataValues}
                    title="Transaction Categories"
                    colors={['rgba(255, 99, 132, 0.2)']}
                    borderColors={['rgba(255, 99, 132, 1)']}
                    width={500}
                    height={450}
                />
            </div>
            <div>
                <CategoriesValuesChart labels={Object.keys(groupedTransactions)} values={Object.values(groupedTransactions)} />
            </div>
        </div>
    );
}
