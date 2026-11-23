import { useContext } from 'react';
import AppModal from './AppModal';
import ModalHeader from './ModalHeader';
import useApiResponseHandler from '../../hooks/useApiResponseHandler';
import { useTranslation } from 'react-i18next';
import { apiBaseUrl } from '../../url';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import sendRequest from '../../utils/asyncUtils/sendRequest'
import { formatDbDate } from '../../utils/formattingUtils/formatDateToDisplay';
import { useInvitationsStore } from '../../store/invitationsStore';
import { DataContext } from '../../store/dataContext';
import { useAuth } from '../../store/authContext';

export const InvitationModal = ({ isOpen, onRequestClose, invitationsData }) => {
    const handleApiResponse = useApiResponseHandler();
    const { refreshData } = useContext(DataContext);
    const { user } = useAuth();
    const { t } = useTranslation("modals");

    const refreshAfterInvitation = async () => {
        await useInvitationsStore.getState().fetchInvitations(user);
        await refreshData();
    };

    const handleAcceptInvitation = async (id, invitedUser) => {
        const invitationData = { invitationId: id, invitedUserId: invitedUser };

        try {
            const acceptResult = await sendRequest('POST', invitationData, `${apiBaseUrl}/invitation/accept`);

            handleApiResponse(acceptResult, {
                onSuccess: async () => {
                    showInfoToast(t("invitationModal.acceptedMessage"));
                    await refreshAfterInvitation();
                    onRequestClose();
                },
                onError: () => showErrorToast(t("invitationModal.failedAccept")),
            });
        } catch {
            showErrorToast(t("invitationModal.failedAccept"));
        }
    };

    const handleDeclineInvitation = async (id) => {
        try {
            const declineResult = await sendRequest('POST', { invitationId: id }, `${apiBaseUrl}/invitation/decline`);
            handleApiResponse(declineResult, {
                onSuccess: async () => {
                    showInfoToast(t("invitationModal.rejectedMessage"));
                    await refreshAfterInvitation();
                    onRequestClose();
                },
                onError: () => showErrorToast(t("invitationModal.failedReject"))
            })
        } catch {
            showErrorToast(t("invitationModal.failedReject"));
        };
    };

    return (
        <AppModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Invitations"
            className="modal-panel max-w-lg"
        >
            <ModalHeader title={t("invitationModal.invite")} onClose={onRequestClose} />
            <ul className="flex flex-col gap-4">
                {invitationsData && invitationsData.map(invitation => (
                    <li key={invitation.id} className="rounded-lg border border-slate-200 bg-page p-4">
                        <div className="flex flex-col gap-3">
                            <p className="text-sm text-ink leading-relaxed">
                                <span>{t("invitationModal.inmate")} </span>
                                <span className="font-semibold">{invitation.invitingUserName}</span>
                                <span> {t("invitationModal.invite")} </span>
                                <span className="font-semibold">{invitation.invitedUserName}</span>
                            </p>
                            <p className="text-xs text-muted">
                                {formatDbDate(invitation.date)}
                            </p>
                            <div className="flex flex-wrap justify-end gap-3">
                                <button
                                    type="button"
                                    className="form-submit-modal-btn"
                                    onClick={() => handleAcceptInvitation(invitation.id, invitation.invitedUser)}
                                >
                                    {t("btnAccept")}
                                </button>
                                <button
                                    type="button"
                                    className="modal-btn-secondary"
                                    onClick={() => handleDeclineInvitation(invitation.id)}
                                >
                                    {t("btnDecline")}
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </AppModal>
    )
}
