import { useState, useContext } from 'react';
import { AuthContext } from '../../store/authContext';
import Modal from 'react-modal';
import Authorization from '../home-page-components/Authorization';
import { showErrorToast } from '../../configs/toastify';
import { useTranslation } from 'react-i18next';

export default function AuthModal({ isOpen, onRequestClose }) {
    const [mode, setMode] = useState(null);
    const { isAuthenticated } = useContext(AuthContext);
    const { t } = useTranslation("common");

    const handleModeChange = (selectedMode) => {
        setMode(selectedMode);
    };

    const handleLoginBtn = (selectedMode) => {
        if (isAuthenticated) {
            showErrorToast('You are currently logged in!');
            return;
        }
        setMode(selectedMode);
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='bg-white rounded-lg p-6 w-11/12 md:w-5/12 mx-auto mt-4 shadow-lg border-4 border-slate-400'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        >
            <div className='w-full h-fit flex flex-col md:flex-row justify-center gap-2 mb-4'>
                <p className='w-full h-fit flex justify-center font-semibold text-md md:text-lg'>TEST LOGIN DATA: </p>
                <span className='w-full h-fit flex justify-center'>testuser@email.pl / Testuser123!!</span>
            </div>
            {mode ? (
                <>
                    <button onClick={onRequestClose} className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'>
                        X
                    </button>
                    <Authorization mode={mode} />
                </>
            ) : (
                <div className='text-center'>
                    <div className='flex justify-around'>
                        <button
                            onClick={() => handleLoginBtn('login')}
                            className='auth-modal-mode-btn'
                        >
                            {t("authElements.modalLoginBtn")}
                        </button>
                        <button
                            onClick={() => handleModeChange('register')}
                            className='auth-modal-mode-btn'
                        >
                            {t("authElements.modalSignUpBtn")}
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    )
}