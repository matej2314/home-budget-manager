import { useContext } from "react";
import { DataContext } from '../../store/dataContext';
import DashboardHeader from "../../components/dashboard/dashboardComponents/DashBoardHeader"

export default function TransactionsCategoriesPage() {
    const { data, isLoading, error } = useContext(DataContext);
    const actionCats = !isLoading && !error && data.dashboardData.actionsCatData || [];

    return (
        <div id="pagecontent" className="bg-slate-200 w-full h-screen">
            <DashboardHeader />
            <div id="middle-content" className="flex gap-5 ">
                <ul className="w-full h-fit flex flex-col items-center justify-center gap-3">
                    {!isLoading && !error && data ? (
                        actionCats.map((cat) => (
                            <li key={cat.id} data-id={cat.id} className="w-full h-fit flex justify-center gap-2">
                                <span>{cat.name}</span> -
                                <span>{cat.type}</span>
                            </li>
                        ))
                    ) : (
                        <p>Brak kategorii.</p>
                    )}
                </ul>
            </div>
        </div>
    )
};