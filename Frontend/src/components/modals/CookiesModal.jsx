import Modal from 'react-modal';
import sendRequest from '../../utils/sendRequest';
import { serverUrl } from '../../url';

export default function CookiesModal() {
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
                    <button type="button">Accept</button>
                    <button type="button">Decline</button>
                </div>
            </div>

        </Modal>
    )
}