import { useContext } from "react";
import { DataContext } from '../../../store/dataContext';
import BarChart from '../../charts/BarChart';

export default function TopCategoriesList({ main }) {
    const { data, isLoading, error } = useContext(DataContext);

    const transactions = !isLoading && !error && data.actionsData;
    const transactionsCategories = transactions.map((action) => action.categoryName);
    const uniqueCategories = new Set(transactionsCategories);

    const categoryPercentages = Array.from(uniqueCategories).map((category) => {
        const categoryCount = transactionsCategories.filter(c => c === category).length;
        const percentage = (categoryCount / transactionsCategories.length) * 100;
        return { label: category, value: percentage };
    });

    const labels = categoryPercentages.map((cat) => cat.label);
    const dataValues = categoryPercentages.map(cat => cat.value);

    return (
        <div className={`w-full h-fit flex flex-col items-center border-2 border-slate-500/20 ${main ? 'mt-4' : 'mt-0'} pb-4`}>
            <h2 className="text-xl mb-4">Top categories of transactions:</h2>
            <ul className="mb-4">
                {categoryPercentages.map((cat) => (
                    <li key={cat.label}>
                        {cat.label} : {cat.value.toFixed(2)} %
                    </li>
                ))}
            </ul>
            <BarChart
                labels={labels}
                dataValues={dataValues}
                title="Transaction Categories"
                colors={['rgba(255, 99, 132, 0.2)']}
                borderColors={['rgba(255, 99, 132, 1)']}
                width={main ? 220 : 350}
                height={main ? 100 : 350}
            />
        </div>
    );
}
