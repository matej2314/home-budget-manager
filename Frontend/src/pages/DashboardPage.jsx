import DashBoardMenu from "../components/dashboard/dashboardComponents/DashBoardMenu";
import { Outlet } from 'react-router-dom';

export default function DashboardPage() {
    return (
        <main className="w-full flex flex-row justify-start overflow-auto bg-slate-200">
            <DashBoardMenu />
            <Outlet />
        </main>
    )
};