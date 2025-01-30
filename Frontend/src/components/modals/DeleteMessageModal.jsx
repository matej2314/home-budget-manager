import Modal from 'react-modal';
import sendRequest from "../../utils/sendRequest";
import { serverUrl } from '../../url';
import { showInfoToast, showErrorToast } from '../../configs/toastify';

export default function DeleteMessageModal({ isOpen, onRequestClose, message }) {

    const handleDeleteMessage = async (messageId) => {
        const delData = {
            messageId: messageId,
        };
        const result = await sendRequest('DELETE', delData, `${serverUrl}/message/delete`)

        if (result.status === 'error') {
            showErrorToast('Nie udało się usunąć wiadomości.');
        } else if (result.status === 'success') {
            showInfoToast('Wiadomość usunięta poprawnie');
            onRequestClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='bg-slate-200 rounded-lg p-6 w-1/3 mx-auto mt-20 shadow-lg border-4 border-slate-400'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        >
            <div className='w-full h-fit flex flex-col justify-center items-center gap-5'>
                <p>{`Czy na pewno chcesz usunąć wiadomość '${message.message}' ?`}</p>
                <div id='btnsDiv' className='w-full h-fit flex justify-around'>
                    <button
                        type="button"
                        className='w-fit h-fit bg-slate-400/45 p-2 rounded-xl shadow-sm shadow-black active:shadow'
                        onClick={() => handleDeleteMessage(message.id)}
                    >
                        Tak
                    </button>
                    <button
                        onClick={onRequestClose}
                        type="button"
                        className='w-fit h-fit bg-slate-400/45 p-2 rounded-xl shadow-sm shadow-black active:shadow'
                    >
                        Nie
                    </button>
                </div>
            </div>
        </Modal>
    )
}