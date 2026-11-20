import AppModal from './AppModal';
import ModalHeader from './ModalHeader';
import AddUserToHouseForm from '../forms/AddUserToHouseForm';
import { useTranslation } from 'react-i18next';

export default function AddUserToHouseModal({ isOpen, onRequestClose }) {
    const { t } = useTranslation("modals");

    return (
        <AppModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel={t("addUserToHouse.heading")}
            className="modal-panel max-w-lg"
        >
            <ModalHeader title={t("addUserToHouse.heading")} onClose={onRequestClose} />
            <AddUserToHouseForm onClose={onRequestClose} />
            <div className="modal-actions">
                <button
                    onClick={onRequestClose}
                    className="modal-btn-secondary"
                    type="button"
                >
                    {t("cancel")}
                </button>
            </div>
        </AppModal>
    )
}
