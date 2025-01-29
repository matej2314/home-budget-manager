import { useContext } from 'react';
import { AuthContext } from '../../store/authContext';
import Modal from 'react-modal';
import SendMessageForm from '../forms/SendMessageForm';

export default function DisplayMessageDetails({ onRequestClose, isOpen, message }) {
    const { user } = useContext(AuthContext);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='bg-slate-300 rounded-lg p-6 w-1/3 h-fit mx-auto my-10 shadow-lg border-4 border-slate-400'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        >
            <button onClick={onRequestClose}
                className='relative left-[28.7rem] bottom-6 text-black hover:text-gray-600'
            >X</button>
            <div className="w-full h-fit flex flex-col items-center gap-3 border-b-2 border-slate-400/20 pb-3">
                <h2 className="text-2xl">Details:</h2>
                <label className="w-full h-fit flex justify-center" htmlFor="senderName">From:</label>
                <input className="bg-slate-200 pl-2" type="text" name="senderName" id="senderName" defaultValue={message.sender} disabled={true} />
                <label className="w-full h-fit flex justify-center" htmlFor="recipientName">For:</label>
                <input className="bg-slate-200 pl-2" type="text" name="recipientName" id="recipientName" defaultValue={message.recipient} disabled={true} />
                <label className="w-full h-fit flex justify-center" htmlFor="receivedMessage">Message:</label>
                <textarea className="bg-slate-200 w-fit h-fit resize-none pl-2" type="text" name="receivedMessage" rows={4} id="receivedMessage" defaultValue={message.message} disabled={true} />
            </div>
            <div className='mt-5 pb-5'>
                {user.userName !== message.sender && <SendMessageForm reply={true} recipientName={message.sender} />}
            </div>
        </Modal>
    )

}