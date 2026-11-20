import AppModal from './AppModal';
import ModalHeader from './ModalHeader';
import DeclareBudgetForm from '../forms/DeclareBudgetForm';
import { useTranslation } from 'react-i18next';

export default function DeclareBudgetModal({ isOpen, onRequestClose }) {
    const { t } = useTranslation("modals");
    const { t: tForms } = useTranslation("forms");

    return (
        <AppModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel={tForms("declareBudget.formHeader")}
            className="modal-panel max-w-md"
        >
            <ModalHeader title={tForms("declareBudget.formHeader")} onClose={onRequestClose} />
            <DeclareBudgetForm onRequestClose={onRequestClose} embedded />
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
