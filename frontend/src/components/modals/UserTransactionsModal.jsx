import AppModal from './AppModal';
import ModalHeader from './ModalHeader';
import TransactionsList from '../dashboard/dashboard-internal-components/TransactionsList';
import { useTransactionsStore } from '../../store/transactionsStore';
import { useTranslation } from 'react-i18next';

export default function UserTransactionsModal({ isOpen, onRequestClose, id }) {
    const { actionsData } = useTransactionsStore();
    const { t } = useTranslation("modals");

    const transactions = Array.isArray(actionsData) ? actionsData : null;

    return (
        <AppModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="User transactions"
            className="modal-panel max-w-3xl"
        >
            <ModalHeader
                title={t("userTransactions.heading", { defaultValue: "Transactions" })}
                onClose={onRequestClose}
            />
            <div className="min-w-0 overflow-x-auto">
                <TransactionsList filterId={id} transactions={transactions} />
            </div>
        </AppModal>
    )
}
