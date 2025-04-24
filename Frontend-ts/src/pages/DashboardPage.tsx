import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@store/authContext";
import { useSocket } from "@store/socketContext";
import useDocumentTitle from '@hooks/useDocumentTitle';
import { useInvitationsStore } from "@store/invitationsStore";
import DashboardMenu from "@components/dashboard/dashboardComponents/DashboardMenu";
import { InvitationModal } from '@components/modals/InvitationModal';
import { useTranslation } from "react-i18next";
import { mateOrHostRole, isHostRole, isUserRole } from "@utils/checkUserRole";
import { useModal } from "@hooks/useModal";
import { Outlet } from "react-router-dom";
import { showMessageToast } from '@configs/toastify'
import LoadingModal from "@components/modals/LoadingModal";
import { Invitation } from "@models/invitationsStoreTypes";
import { ConvertedInvitation, convertSocketInvitation } from "@utils/convertSocketInvitation";

export default function DashboardPage() {
    useDocumentTitle('Dashboard');
    const navigate = useNavigate();
    const { loginStatus, isAuthenticated, user } = useContext(AuthContext)!;
    const { connected, messages } = useSocket();
    const { invitationsData, invitationsLoading, invitationsLoadingError, fetchInvitations, fetchedInvitations } = useInvitationsStore();
    const { modal, openModal, closeModal } = useModal<(Invitation | ConvertedInvitation)[] | null>({ isOpen: false, modalType: '', data: null });
    const { t } = useTranslation("common");

    const liveMessages = connected && messages ?  messages.newMessages : [];
    const dbInvitations = !invitationsLoading && !invitationsLoadingError && invitationsData || [];
    const invitationsMessages = connected && messages ? messages.invitations : [];
    const isMateOrHost = mateOrHostRole(user);
    const isUser = isUserRole(user);
    const isHost = isHostRole(user);

    const convertedInvitationsMessages: ConvertedInvitation[] = convertSocketInvitation(invitationsMessages);

    const allInvitations = [
        ...(Array.isArray(dbInvitations) ? dbInvitations : []),
        ...(Array.isArray(convertedInvitationsMessages) ? convertedInvitationsMessages : []),
    ];

    useEffect(() => {
        if (connected && liveMessages?.length > 0) {
            showMessageToast(t("notifications.newMessageNotice"));
        };

        if (!loginStatus.isLoading && isAuthenticated && isUser) {
            navigate("/userDashboard");
        }

        if (!invitationsLoading && !invitationsLoadingError && !fetchedInvitations && allInvitations.length == 0) {
            fetchInvitations();
        };

        if (allInvitations.length > 0) {
            openModal('invitation', allInvitations);
        };

    }, [liveMessages, connected, loginStatus, isAuthenticated, isUser, fetchedInvitations]);

    if (loginStatus.isLoading) return <LoadingModal isOpen={loginStatus.isLoading} />;

    return (
        isMateOrHost ? (
            <main className="w-full h-full flex flex-row justify-around items-stretch overflow-y-hidden bg-slate-200">
                <DashboardMenu />
                <Outlet />
                {isHost && modal && modal.modalType === 'invitation' ? <InvitationModal isOpen={modal.isOpen} onRequestClose={closeModal} invitationsData={modal.data} /> : null}
            </main>
        ) : null
    );
};
