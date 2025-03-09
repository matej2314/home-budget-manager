import { useContext } from 'react';
import { AuthContext } from '../../../store/authContext';
import { useMessagesStore } from '../../../store/messagesStore';
import Modal from 'react-modal';
import SendMessageForm from '../../forms/SendMessageForm';
import { serverUrl } from '../../../url';
import sendRequest from "../../../utils/asyncUtils/sendRequest";
import { showInfoToast, showErrorToast } from '../../../configs/toastify';
import { Icon } from '@iconify/react';

export function SendMessageModal({ isOpen, onRequestClose, recipient }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='bg-slate-200 rounded-lg p-6 w-10/12 xl:w-1/3 mx-auto mt-20 shadow-lg border-4 border-slate-400'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        >
            <div className='w-full flex justify-end'>
                <button onClick={onRequestClose}
                    className='relative left-3 bottom-6 text-black hover:text-gray-600'
                >X</button>
            </div>

            <SendMessageForm reply={false} recipientName={recipient} onClose={onRequestClose} />
        </Modal>
    )
}

export function DeleteMessageModal({ isOpen, onRequestClose, message }) {
    const { fetchMessages } = useMessagesStore();


    const handleDeleteMessage = async (messageId) => {
        const delData = {
            messageId: messageId,
        };
        const result = await sendRequest('DELETE', delData, `${serverUrl}/message/delete`)

        if (result.status === 'error') {
            showErrorToast('Failed to deleting message.');
        } else if (result.status === 'success') {
            showInfoToast('Message deleted correctly.');
            onRequestClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='del-msg-modal'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        >
            <div className='w-full h-fit flex flex-col justify-center items-center gap-5'>
                <p>{`Are you sure you want to delete the message '${message.message}' ?`}</p>
                <div id='btnsDiv' className='w-full h-fit flex justify-around'>
                    <button
                        type="button"
                        className="form-submit-modal-btn"
                        onClick={() => handleDeleteMessage(message.id)}
                    >
                        Yes
                    </button>
                    <button
                        onClick={onRequestClose}
                        type="button"
                        className="form-submit-modal-btn"
                    >
                        No
                    </button>
                </div>
            </div>
        </Modal>
    )
}
export function DisplayMessageDetails({ isOpen, onRequestClose, message }) {
    const { user } = useContext(AuthContext);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='display-msg-modal'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        >
            <div className='relative w-full flex justify-end'>
                <button onClick={onRequestClose}
                    className='absolute -translate-y-6 translate-x-4 text-black hover:text-gray-600'
                >X</button>
            </div>

            <div className="w-full h-fit flex flex-col items-center gap-3 border-b-2 border-slate-400/20 pb-3">
                <h2 className="text-2xl">Details:</h2>
                <form className='w-full h-fit flex flex-col items-center gap-3'>
                    <label className="w-full h-fit flex justify-center" htmlFor="senderName">From:</label>
                    <div className='relative w-fit'>
                        <input
                            className="bg-slate-200 input-display-msg" type="text"
                            name="senderName"
                            id="senderName"
                            defaultValue={message.sender}
                            disabled={true}
                        />
                        <Icon
                            icon='mage:user-fill'
                            color='#0e63d6'
                            className="icon-base top-[0.1rem] text-gray-500 text-xl text-opacity-40"
                        />
                    </div>

                    <label className="w-full h-fit flex justify-center" htmlFor="recipientName">For:</label>
                    <div className='relative w-fit'>
                        <input
                            className="bg-slate-200 input-display-msg" type="text"
                            name="recipientName"
                            id="recipientName"
                            defaultValue={message.recipient}
                            disabled={true}
                        />
                        <Icon
                            icon='mage:user-fill'
                            color='#168709'
                            className="icon-base top-[0.1rem] text-gray-500 text-xl"
                        />
                    </div>

                    <label className="w-full h-fit flex justify-center" htmlFor="receivedMessage">Message:</label>
                    <textarea
                        className="bg-slate-200 w-fit h-fit resize-none input-display-msg"
                        type="text"
                        name="receivedMessage"
                        rows={4}
                        id="receivedMessage"
                        defaultValue={message.message}
                        disabled={true}
                    />
                </form>

            </div>
            <div className='mt-5 pb-5'>
                {user.userName !== message.sender && <SendMessageForm reply={true} recipientName={message.sender} />}
            </div>
        </Modal>
    )

}

export function ReplyMessageModal({ isOpen, onRequestClose, message }) {

    const recipientName = isOpen && message && message.sender || null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='bg-slate-200 rounded-lg p-6 w-1/3 mx-auto mt-20 shadow-lg border-4 border-slate-400'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        >
            <button onClick={onRequestClose}
                className='relative left-[28.7rem] bottom-6 text-black hover:text-gray-600'
            >X</button>
            <SendMessageForm reply={true} recipientName={recipientName} />
        </Modal>
    )
}