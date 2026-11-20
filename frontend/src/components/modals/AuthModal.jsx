import { useState } from 'react';
import { useAuth } from '../../store/authContext';
import AppModal from './AppModal';
import ModalHeader from './ModalHeader';
import Authorization from '../home-page-components/Authorization';
import { showErrorToast } from '../../configs/toastify';
import { useTranslation } from 'react-i18next';

export default function AuthModal({ isOpen, onRequestClose }) {
    const [mode, setMode] = useState(null);
    const { isAuthenticated } = useAuth();
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

    const title = mode === 'login'
        ? t("authElements.modalLoginBtn")
        : mode === 'register'
            ? t("authElements.modalSignUpBtn")
            : t("authElements.modalLoginBtn") + ' / ' + t("authElements.modalSignUpBtn");

    return (
        <AppModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Authentication"
            className="modal-panel max-w-lg"
        >
            <ModalHeader title={title} onClose={onRequestClose} />
            <div className="mb-5 rounded-lg bg-page border border-slate-200 px-3 py-2 text-sm text-muted">
                <span className="font-medium text-ink">TEST LOGIN DATA: </span>
                testuser@email.pl / Testuser123!!
            </div>
            {mode ? (
                <Authorization mode={mode} />
            ) : (
                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => handleLoginBtn('login')}
                        className="auth-modal-mode-btn"
                        type="button"
                    >
                        {t("authElements.modalLoginBtn")}
                    </button>
                    <button
                        onClick={() => handleModeChange('register')}
                        className="auth-modal-mode-btn"
                        type="button"
                    >
                        {t("authElements.modalSignUpBtn")}
                    </button>
                </div>
            )}
        </AppModal>
    )
}
