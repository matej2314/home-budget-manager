import { useContext } from "react";
import { DataContext } from '../../../store/dataContext';
import PieChart from "../../charts/PieChart";

export default function TopCategoriesList() {
    const { data, isLoading, error } = useContext(DataContext);

    const transactions = !isLoading && !error && data.dashboardData.actionsData || [];
    const transactionsCategories = transactions.map((action) => action.categoryName);
    const uniqueCategories = new Set(transactionsCategories);

    const categoryPercentages = Array.from(uniqueCategories).map((category) => {
        const categoryCount = transactionsCategories.filter(c => c === category).length;
        const percentage = (categoryCount / transactionsCategories.length) * 100;
        return { label: category, value: percentage };
    });

    return (
        <div className="w-1/3 h-fit flex flex-col items-center border-2 border-slate-500/20 my-4 pt-2 pb-4 mr-5">
            <h2 className="text-xl mb-4">Top categories of transactions:</h2>
            <ul className="mb-4">
                {categoryPercentages.map((cat) => (
                    <li key={cat.label}>
                        {cat.label} : {cat.value.toFixed(2)} %
                    </li>
                ))}
            </ul>

            <PieChart
                data={categoryPercentages}
                width={300}
                height={350}
                margin={0}
                showLabel={false}
                legendPosition='top'
                colors={["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0"]}
            />
        </div>
    );
}
