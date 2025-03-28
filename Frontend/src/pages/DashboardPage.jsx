import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../store/authContext";
import { useSocket } from "../store/socketContext";
import useDocumentTitle from '../hooks/useDocumentTitle';
import DashBoardMenu from "../components/dashboard/dashboardComponents/DashBoardMenu";
import { InvitationModal } from '../components/modals/invitationModal';
import { useTranslation } from "react-i18next";
import useModal from '../hooks/useModal';
import { Outlet } from "react-router-dom";
import { showMessageToast } from '../configs/toastify'

export default function DashboardPage() {
    useDocumentTitle('Dashboard');
    const navigate = useNavigate();
    const { loginStatus, isAuthenticated, user } = useContext(AuthContext);
    const { connected, messages } = useSocket();
    const { modal, openModal, closeModal } = useModal({ isOpen: false, type: null, data: null });
    const { t } = useTranslation("common");

    const liveMessages = connected && messages?.newMessages;
    const invitationsMessages = connected && messages?.invitations;
    const isMateOrHost = user?.role === "mate" || user?.role === "host";
    const isUser = user?.role === "user";
    const isHost = user?.role === 'host';

    useEffect(() => {
        if (connected && liveMessages?.length > 0) {
            showMessageToast(t("notifications.newMessageNotice"));
        };

        if (!loginStatus.isLoading && isAuthenticated && isUser) {
            navigate("/userDashboard");
        }

        if (invitationsMessages && invitationsMessages.length > 0) {
            openModal('invitation', invitationsMessages)
        }

    }, [liveMessages, invitationsMessages, connected, loginStatus, isAuthenticated, isUser, navigate]);

    if (loginStatus.isLoading || !isAuthenticated || !user) return null;

    return (
        isMateOrHost ? (
            <main className="w-full h-full flex flex-row justify-around items-stretch overflow-y-hidden bg-slate-200">
                <DashBoardMenu />
                <Outlet />
                {isHost && modal && modal.type === 'invitation' ? <InvitationModal isOpen={modal.isOpen} onRequestClose={closeModal} invitationsData={modal.data} /> : null}
            </main>
        ) : null
    );
};
