import { useContext } from "react";
import { DataContext } from '../store/dataContext';
import DashBoardMenu from "../components/dashboard/dashboardComponents/DashBoardMenu";
import { Outlet } from 'react-router-dom';

export default function DashboardPage() {
    const { data, isLoading, error } = useContext(DataContext);

    return (
        <>
            {!isLoading && !error && data && <main className="w-screen h-full flex flex-row justify-around items-stretch overflow-y-hidden bg-slate-200">
                <DashBoardMenu />
                <Outlet />
            </main>}
        </>
    )
};