import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from '../store/dataContext';
import { AuthContext } from "../store/authContext";
import { useSocket } from "../store/socketContext";
import DashBoardMenu from "../components/dashboard/dashboardComponents/DashBoardMenu";
import { Outlet } from 'react-router-dom';
import { showCookiesInfo } from '../configs/toastify';

export default function DashboardPage() {
    const { user } = useContext(AuthContext);
    const { connected, messages } = useSocket();
    const navigate = useNavigate();

    const liveMessages = connected && messages.newMessages;
    const referrer = document.referrer;
    const domain = window.location.origin;

    useEffect(() => {
        if (connected && liveMessages?.length > 0) {
            showMessageToast('Otrzymałeś nową wiadomość!');
        }
    }, [liveMessages, connected]);

    useEffect(() => {

        if (!referrer && !referrer.includes(domain)) {
            showCookiesInfo('Strona wykorzystuje Cookies.', 'Szczegółowe informacje odnajdziesz w swoim profilu użytkownika')
        }
    }, [referrer]);

    return (
        <>
            {user.role === 'mate' || user.role === 'host' ? (
                <main className="w-screen h-full flex flex-row justify-around items-stretch overflow-y-hidden bg-slate-200">
                    <DashBoardMenu />
                    <Outlet />
                </main>
            ) : user.role === 'user' && navigate('/userDashboard')}
        </>
    )
};