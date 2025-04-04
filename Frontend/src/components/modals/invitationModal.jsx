import Modal from 'react-modal';
import { Icon } from '@iconify/react';
import useApiResponseHandler from '../../hooks/useApiResponseHandler';
import { serverUrl } from '../../url';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import sendRequest from '../../utils/asyncUtils/sendRequest'

export const InvitationModal = ({ isOpen, onRequestClose, invitationsData }) => {
    const handleApiResponse = useApiResponseHandler();

    const handleAcceptInvitation = async (id, invitedUser) => {
        const invitationData = { invitationId: id, invitedUserId: invitedUser };

        try {
            const acceptResult = await sendRequest('POST', invitationData, `${serverUrl}/invitation/accept`);

            handleApiResponse(acceptResult, {
                onSuccess: () => { showInfoToast('Invitation successfully accepted'), onRequestClose() },
                onError: () => showErrorToast('Failed to accept invitation'),
            });
        } catch (error) {
            showErrorToast('Failed to accept invitation');
        }
    };

    const handleDeclineInvitation = async (id) => {
        try {
            const declineResult = await sendRequest('POST', { invitationId: id }, `${serverUrl}/invitation/decline`);
            handleApiResponse(declineResult, {
                onSuccess: () => {
                    showInfoToast('Invitation successfully rejected.'),
                        onRequestClose();
                },
                onError: () => showErrorToast('Failed to reject invitation.')
            })
        } catch (error) {
            showErrorToast('Failed to reject invitation');
        };
    };

    return (
        <Modal
            isOpen={isOpen}
            className='bg-slate-200 rounded-lg p-6 md:w-1/2 md:mb-[10rem] lg:mt-[25rem] xl:mb-[17rem] xl:w-1/3 mx-auto mt-10 shadow-lg border-4 border-slate-400'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        >
            <button onClick={onRequestClose} className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'>
                X
            </button>
            <ul>
                {invitationsData && invitationsData.map(invitation => (
                    <li key={invitation.invitationId}>
                        <div>
                            <p>User {invitation.invitingUser} invite {invitation.invitedUser}</p>
                            <div>
                                <button
                                    type="button"
                                    onClick={() => handleAcceptInvitation(invitation.invitationId, invitation.invitedUser)}
                                >
                                    Accept
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeclineInvitation(invitation.invitationId)}
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </Modal>
    )
}