import { useState, useRef } from 'react';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import Modal from 'react-modal';
import { serverUrl } from '../../url';
import { showErrorToast, showInfoToast } from '../../configs/toastify';
import LoadingModal from '../modals/LoadingModal';


export default function ChangeEmailModal({ handleOpen, onRequestClose }) {
    const [sended, setSended] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const newEmailAddr = useRef();

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const handleSaveNewEmail = async (e) => {
        e.preventDefault();

        if (newEmailAddr.current.value === '' || !emailRegex.test(newEmailAddr.current.value)) {
            showErrorToast('Podaj prawidłowy adres e-mail!');
        };

        const emailData = {
            newEmail: newEmailAddr.current.value,
        };

        try {
            setSended(false);
            setIsLoading(true);
            const saveEmail = await sendRequest('POST', emailData, `${serverUrl}/users/changemail`);

            if (saveEmail.status === 'error') {
                showErrorToast(saveEmail.message);
            } else if (saveEmail.status === 'success') {
                showInfoToast(saveEmail.message);
                setTimeout(() => {
                    onRequestClose();
                }, 500);
            };

        } catch (error) {
            console.error(error);
        } finally {
            setSended(true);
            setIsLoading(false);
        };
    };

    return (
        <Modal
            isOpen={handleOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add New Transaction"
            className="w-[400px] p-6 bg-slate-200 rounded-lg shadow-lg translate-x-[40vw] translate-y-[30vh]"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <h2 className='w-full h-fit flex justify-center text-xl font-semibold'>Change your e-mail</h2>
            <div>
                <form
                    onSubmit={handleSaveNewEmail}
                    className='w-full h-fit flex flex-col justify-start items-center gap-4 mt-5'
                >
                    <label htmlFor="newEmailAddr">Type your new e-mail address:</label>
                    <input
                        type="email"
                        name="newEmailAddr"
                        id="newEmailAddr"
                        ref={newEmailAddr}
                    />
                    <button
                        type="submit"
                        disabled={sended}
                        className='text-xl bg-gray-300 text-black p-2 rounded-xl border-[1px] border-slate-500 hover:bg-slate-400'
                    >
                        Save
                    </button>
                </form>
                {isLoading && <LoadingModal isOpen={isLoading} />}
            </div>
        </Modal>
    )
}