import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../store/authContext";
import { useSocket } from "../store/socketContext";
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useInvitationsStore } from "../store/invitationsStore";
import DashBoardMenu from "../components/dashboard/dashboardComponents/DashBoardMenu";
import { InvitationModal } from '../components/modals/invitationModal';
import { useTranslation } from "react-i18next";
import { mateOrHostRole, isHostRole, isUserRole } from "../utils/checkUserRole";
import useModal from '../hooks/useModal';
import { Outlet } from "react-router-dom";
import { showMessageToast } from '../configs/toastify'
import LoadingModal from "../components/modals/LoadingModal";

export default function DashboardPage() {
    useDocumentTitle('Dashboard');
    const navigate = useNavigate();
    const { loginStatus, isAuthenticated, user } = useContext(AuthContext);
    const { connected, messages } = useSocket();
    const { invitationsData, invitationsLoading, invitationsLoadingError } = useInvitationsStore();
    const { modal, openModal, closeModal } = useModal({ isOpen: false, type: null, data: null });
    const { t } = useTranslation("common");

    const liveMessages = connected && messages?.newMessages;
    const dbInvitations = !invitationsLoading && !invitationsLoadingError && invitationsData || [];
    const invitationsMessages = connected && messages?.invitations;
    const isMateOrHost = mateOrHostRole(user);
    const isUser = isUserRole(user);
    const isHost = isHostRole(user);

    const allInvitations = [
        ...(Array.isArray(dbInvitations) ? dbInvitations : []),
        ...(Array.isArray(invitationsMessages) ? invitationsMessages : []),
    ];

    useEffect(() => {
        if (connected && liveMessages?.length > 0) {
            showMessageToast(t("notifications.newMessageNotice"));
        };

        if (!loginStatus.isLoading && isAuthenticated && isUser) {
            navigate("/userDashboard");
        }

        if (allInvitations && allInvitations.length > 0) {
            openModal('invitation', allInvitations)
        }

    }, [liveMessages, allInvitations, connected, loginStatus, isAuthenticated, isUser, navigate]);

    if (loginStatus.isLoading) return <LoadingModal isOpen={loginStatus.isLoading} />;

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
