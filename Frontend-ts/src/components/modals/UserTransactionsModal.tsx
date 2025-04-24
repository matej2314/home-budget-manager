import Modal from 'react-modal';
import TransactionsList from '../dashboard/dashboard-internal-components/TransactionsList';
import { useTransactionsStore } from '../../store/transactionsStore';
import { type Transaction } from '@models/transactionsStoreTypes';

interface UserTransactionsModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    id: string;
}

export default function UserTransactionsModal({ isOpen, onRequestClose, id } : UserTransactionsModalProps) {
    const { actionsData } = useTransactionsStore();

    const transactions = Array.isArray(actionsData) ? actionsData : null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='bg-slate-200 rounded-lg p-6 mx-auto mt-10 shadow-lg border-4 border-slate-400'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        >
            <button onClick={onRequestClose} className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'>
                X
            </button>
            <TransactionsList filterId={id} mainSite={false} transactions={transactions as Transaction[]} />
        </Modal>
    )
}