import { useContext } from "react"
import { DataContext } from '../../../store/dataContext';

export default function TopCategoriesList() {

    const { data, isLoading, error } = useContext(DataContext);

    const transactions = !isLoading && !error && data.dashboardData.actionsData || [];
    const transactionsCategories = transactions.map((action) => action.categoryName);
    const uniqueCategories = new Set(transactionsCategories);

    const categoryPercentages = Array.from(uniqueCategories).map((category) => {
        const categoryCount = transactionsCategories.filter(c => c === category).length;
        const percentage = (categoryCount / transactionsCategories.length) * 100;
        return { category, percentage };
    })

    return (
        <div id='transactions-top-categories' className="w-1/2 h-[25.5rem] flex flex-col justify-start rounded-md border-2 border-slate-500/20 mr-5 gap-3 my-4 py-2 px-[4rem]">
            <h2 className="w-full h-fit flex justify-center text-xl">Top categories of transactions:</h2>
            <ul className="w-full h-fit flex flex-col justify-center items-center gap-3">
                {categoryPercentages.map((cat) => (
                    <li key={cat.category} className="w-full flex justify-center gap-2"><span>{cat.category}</span>-<span>{cat.percentage.toFixed(2)} %</span></li>
                ))}
            </ul>
        </div>
    )
}