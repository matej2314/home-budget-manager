import AppModal from './AppModal';
import ModalHeader from './ModalHeader';
import { useTranslation } from 'react-i18next';

export default function LogOutModal({ isOpen, onRequestClose, handleLogOut }) {
    const { t } = useTranslation("modals");

    return (
        <AppModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel={t("logOut.heading")}
            className="modal-panel max-w-sm"
        >
            <ModalHeader title={t("logOut.heading")} onClose={onRequestClose} />
            <div className="modal-actions-center">
                <button
                    className="form-submit-modal-btn"
                    onClick={handleLogOut}
                    type="button"
                >
                    {t("btnYes")}
                </button>
                <button
                    onClick={onRequestClose}
                    className="modal-btn-secondary"
                    type="button"
                >
                    {t("btnNo")}
                </button>
            </div>
        </AppModal>
    )
}
