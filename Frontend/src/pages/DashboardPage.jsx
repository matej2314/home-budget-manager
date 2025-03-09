import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../store/authContext";
import { useSocket } from "../store/socketContext";
import useDocumentTitle from '../hooks/useDocumentTitle';
import DashBoardMenu from "../components/dashboard/dashboardComponents/DashBoardMenu";
import { Outlet } from "react-router-dom";
import { showMessageToast } from '../configs/toastify'

export default function DashboardPage() {
    useDocumentTitle('Dashboard');
    const navigate = useNavigate();
    const { user, isLoading, isAuthenticated } = useContext(AuthContext);
    const { connected, messages } = useSocket();


    const liveMessages = connected && messages?.newMessages;
    const isMateOrHost = user?.role === "mate" || user?.role === "host";
    const isUser = user?.role === "user";

    useEffect(() => {
        if (connected && liveMessages?.length > 0) {
            showMessageToast("Otrzymałeś nową wiadomość!");
        };

        if (!isLoading && isAuthenticated && isUser) {
            navigate("/userDashboard");
        }

    }, [liveMessages, connected, isLoading, isAuthenticated, isUser, navigate]);

    if (isLoading || !isAuthenticated || !user) return null;

    return (
        isMateOrHost ? (
            <main className="w-full h-full flex flex-row justify-around items-stretch overflow-y-hidden bg-slate-200">
                <DashBoardMenu />
                <Outlet />
            </main>
        ) : null
    );
};
