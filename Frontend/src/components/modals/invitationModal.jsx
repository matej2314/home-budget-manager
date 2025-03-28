import Modal from 'react-modal';
import { Icon } from '@iconify/react';
import useApiResponseHandler from '../../hooks/useApiResponseHandler';
import { serverUrl } from '../../url';


export const InvitationModal = ({ isOpen, onRequestClose, invitationsData }) => {
    const handleApiResponse = useApiResponseHandler();

    const handleAcceptInvitation = async () => {

    };

    const handleDeclineInvitation = async () => {

    }

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
                                <button type="button">Accept</button>
                                <button type="button">Decline</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </Modal>
    )
}