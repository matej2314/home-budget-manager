import { useContext, useEffect } from "react";
import { DataContext } from '../store/dataContext';
import { AuthContext } from "../store/authContext";
import { useSocket } from "../store/socketContext";
import DashBoardMenu from "../components/dashboard/dashboardComponents/DashBoardMenu";
import { Outlet } from 'react-router-dom';
import { showMessageToast } from '../configs/toastify';

export default function DashboardPage() {
    const { data, isLoading, error } = useContext(DataContext);
    const { isAuthenticated, user } = useContext(AuthContext);
    const { connected, messages } = useSocket();

    const liveMessages = connected && messages.newMessages;

    useEffect(() => {
        if (connected && liveMessages.length > 0) {
            showMessageToast('Otrzymałeś nową wiadomość!');
        }
    }, [liveMessages, connected]);

    return (
        <>
            {!isLoading && !error && data && isAuthenticated &&
                <main className="w-screen h-full flex flex-row justify-around items-stretch overflow-y-hidden bg-slate-200">
                    <DashBoardMenu />
                    <Outlet />
                </main>}
        </>
    )
};