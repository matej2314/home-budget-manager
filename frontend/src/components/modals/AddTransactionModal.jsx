import AppModal from './AppModal';
import ModalHeader from './ModalHeader';
import AddTransactionForm from '../forms/AddTransactionForm';
import { useTranslation } from 'react-i18next';

export default function AddTransactionModal({ isOpen, onRequestClose }) {
    const { t } = useTranslation("modals");

    return (
        <AppModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel={t("addTransaction.heading")}
            className="modal-panel max-w-md"
        >
            <ModalHeader title={t("addTransaction.heading")} onClose={onRequestClose} />
            <AddTransactionForm onClose={onRequestClose} />
        </AppModal>
    )
}
