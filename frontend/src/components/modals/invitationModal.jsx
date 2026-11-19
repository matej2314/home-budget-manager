import { useContext } from 'react';
import Modal from 'react-modal';
import useApiResponseHandler from '../../hooks/useApiResponseHandler';
import { useTranslation } from 'react-i18next';
import { apiBaseUrl } from '../../url';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import sendRequest from '../../utils/asyncUtils/sendRequest'
import { formatDbDate } from '../../utils/formattingUtils/formatDateToDisplay';
import { useInvitationsStore } from '../../store/invitationsStore';
import { DataContext } from '../../store/dataContext';

export const InvitationModal = ({ isOpen, onRequestClose, invitationsData }) => {
    const handleApiResponse = useApiResponseHandler();
    const { refreshData } = useContext(DataContext);
    const { t } = useTranslation("modals");

    const refreshAfterInvitation = async () => {
        await useInvitationsStore.getState().fetchInvitations();
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
        <Modal
            isOpen={isOpen}
            className='relative bg-slate-200 rounded-lg p-6 md:w-1/2 md:mb-[10rem] lg:mt-[25rem] xl:mb-[17rem] xl:w-1/3 mx-auto mt-10 shadow-lg border-4 border-slate-400'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        >
            <button onClick={onRequestClose} className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'>
                X
            </button>
            <ul className=''>
                {invitationsData && invitationsData.map(invitation => (
                    <li key={invitation.id}>
                        <div className='w-full h-fit flex flex-col gap-2'>
                            <p className='w-full flex justify-center gap-2'>
                                <span>{t("invitationModal.housemate")}</span>
                                <span className='font-semibold'>{invitation.invitingUserName}</span>
                                <span>{t("invitationModal.invite")}</span>
                                <span className='font-semibold'>{invitation.invitedUserName}</span>
                            </p>
                            <p className='w-full flex justify-center gap-2'>
                                <span>
                                    Date:
                                </span>
                                <span>
                                    {formatDbDate(invitation.date)}
                                </span>
                            </p>
                            <div className='w-full flex justify-center gap-7'>
                                <button
                                    type="button"
                                    className='form-submit-modal-btn'
                                    onClick={() => handleAcceptInvitation(invitation.id, invitation.invitedUser)}
                                >
                                    {t("btnAccept")}
                                </button>
                                <button
                                    type="button"
                                    className='form-submit-modal-btn'
                                    onClick={() => handleDeclineInvitation(invitation.id)}
                                >
                                    {t("btnDecline")}
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </Modal>
    )
}