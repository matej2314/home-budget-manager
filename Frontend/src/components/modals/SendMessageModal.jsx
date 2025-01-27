import Modal from 'react-modal';
import SendMessageForm from '../forms/SendMessageForm';

export default function SendMessageModal({ isOpen, onRequestClose }) {
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
            <SendMessageForm />
        </Modal>
    )
}