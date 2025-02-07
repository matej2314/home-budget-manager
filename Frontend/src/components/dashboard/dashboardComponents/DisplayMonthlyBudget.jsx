import { useContext } from "react"
import { DataContext } from '../../../store/dataContext';

export default function MonthlyBudget() {
    const { data, isLoading, error } = useContext(DataContext);
    const houseData = !isLoading && !error && data.houseData[0] || [];
    const lastMonthlyBudget = houseData.lastInitialBudget || '';
    const initBudgetDate = houseData.initialDefinedAt || '';
    const validDate = houseData.initialValidUntil || '';

    return (
        <div id="monthlyBudget" className="w-1/4 h-[8.5rem] bg-green-600/80 text-xl text-white flex flex-col justify-start items-center rounded-md pt-4">
            <div className="h-11/12 w-11/12 flex flex-col justify-center items-center gap-4">
                <h2 className="text-xl">Declared monthly budget:</h2>
                <span className="text-xl text-white">{lastMonthlyBudget}</span>
                <span className="text-sm">{initBudgetDate} - {validDate}</span>
            </div>
        </div>
    )
}