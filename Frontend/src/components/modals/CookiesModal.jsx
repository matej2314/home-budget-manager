import Modal from 'react-modal';
import sendRequest from '../../utils/sendRequest';
import { serverUrl } from '../../url';
import { showInfoToast, showErrorToast } from '../../configs/toastify';

Modal.setAppElement('#root');

export default function CookiesModal({ handleOpen, onRequestClose }) {

    const handleSaveCookieValue = async (value) => {

        if (value === undefined || value === null) {
            showErrorToast('Nie udało się zapisać wartości.');
            return;
        };

        const data = {
            cookieValue: value,
        };

        try {
            const saveValue = await sendRequest('POST', data, `${serverUrl}/cookiestour/cookie_value`);

            if (saveValue.status === 'error') {
                showErrorToast(saveValue.message)
            } else if (saveValue.status === 'success') {
                showInfoToast('Ustawienia zostały zapisane.');
                setTimeout(() => {
                    onRequestClose();
                }, 500);
            }
        } catch (error) {
            console.error(error);
        }

    }

    return (
        <Modal
            isOpen={handleOpen}
            onRequestClose={onRequestClose}
            className="w-[400px] p-6 bg-slate-200 rounded-lg shadow-lg translate-x-[40vw] translate-y-[10vh]"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div className='w-full h-fit flex flex-col items-center gap-4'>
                <p>Na tej stronie wykorzystujemy pliki cookies w celu uwierzytelniania użytkowników oraz zbierania anonimowych statystyk
                    dotyczących ruchu i sposobu korzystania ze strony (Google Analytics). Nie przechowujemy żadnych danych reklamowych ani
                    śledzących.Więcej informacji znajdziesz w naszej Polityce Prywatności.
                </p>
                <div className='w-full h-fit flex justify-center gap-3'>
                    <button
                        className='w-fit h-fit p-2 border-[1px] border-slate-400 rounded-xl'
                        type="button"
                        onClick={() => handleSaveCookieValue(1)}
                    >
                        Accept all
                    </button>
                    <button
                        className='w-fit h-fit p-2 border-[1px] border-slate-400 rounded-xl'
                        type="button"
                        onClick={() => handleSaveCookieValue(0)}
                    >
                        Only mandatory
                    </button>
                </div>
            </div>
        </Modal>
    )
}