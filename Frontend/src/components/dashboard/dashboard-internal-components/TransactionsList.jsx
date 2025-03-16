import useModal from '../../../hooks/useModal';
import { Icon } from '@iconify/react';
import { useMediaQuery } from 'react-responsive';
import LoadingModal from '../../modals/LoadingModal';
import { tableLabels } from '../../../utils/arraysUtils/actionsTableLabels';
import { formatDbDate } from '../../../utils/formattingUtils/formatDateToDisplay';
import { filterArray } from '../../../utils/arraysUtils/arraysFunctions';
import DeleteTransactionModal from '../../modals/DeleteTransactionModal';

export default function TransactionsList({ limit, mainSite, filterId, transactions, actionsLoading, actionsError, actionsTotalPages, getTransactions }) {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const { modal, openModal, closeModal } = useModal({ isOpen: false, type: 'delete', data: null });

    const filteredTransactions = filterId ? filterArray(transactions, (transaction) => transaction.userId === filterId) : transactions;
    const sortedTransactions = Array.isArray(filteredTransactions)
        ? [...filteredTransactions].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
        : [];
    const transactionsToDisplay = limit ? sortedTransactions.slice(0, limit) : sortedTransactions;

    const handleDeleteAction = (transaction) => {
        openModal('delete', transaction);
    };

    return (
        <div className="w-full h-full overflow-auto pb-4">
            <div className='w-full h-fit flex justify-end gap-3 pr-5 mb-2'>
                {Array.from({ length: actionsTotalPages }, (_, index) => (
                    <button
                        key={index}
                        className=''
                        onClick={() => getTransactions(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            {!actionsLoading && !actionsError ? (
                <table className={`${mainSite ? 'w-[97%] mx-auto' : 'w-full'} transactions-list-table`}>
                    <thead className='text-[0.6rem] indirect:text-sm md:text-sm'>
                        <tr className={`border-b ${mainSite ? 'bg-slate-400/50' : 'bg-slate-400/80'}`}>
                            {tableLabels.map((label, index) => (
                                <th
                                    key={index}
                                    className={`px-2 lg:px-4 py-2 text-left 
                                    ${index === 0 ? 'rounded-tl-xl' : ''} 
                                    ${mainSite && index === tableLabels.length - 1 ? 'rounded-tr-xl' : ''}`}
                                >
                                    {label}
                                </th>
                            ))}
                            {!mainSite && <th className="px-4 py-2 text-left rounded-tr-xl">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="border-x-[1px] border-slate-400 text-[0.6rem] indirect:text-sm md:text-sm">
                        {transactionsToDisplay.map((transaction) => (
                            <tr key={transaction.transactionId}
                                className={`border-b ${transaction.transactionId === transactionsToDisplay.length - 1 ? 'border-b-2 border-slate-400' : 'border-none'}`}>
                                <td className="pl-2 transactions-list-table-data">{`${transaction.value} zł`}</td>
                                <td className="transactions-list-table-data">{transaction.type}</td>
                                <td className="transactions-list-table-data">{transaction.categoryName}</td>
                                <td className="transactions-list-table-data">{transaction.userName}</td>
                                <td className="transactions-list-table-data">
                                    {!isMobile ? formatDbDate(transaction.addedAt) : formatDbDate(transaction.addedAt, 'split')}
                                </td>
                                {!mainSite && (
                                    <td className="px-4 py-2">
                                        <button
                                            type="button"
                                            className="w-fit h-fit"
                                            onClick={() => handleDeleteAction(transaction)}
                                            title="Delete transaction"
                                        >
                                            <Icon icon='material-symbols:delete-outline' width={20} height={20} />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Brak transakcji</p>
            )}
            {actionsLoading && <LoadingModal isOpen={actionsLoading} />}
            {modal && modal.isOpen && modal.type === 'delete' && <DeleteTransactionModal isOpen={modal.isOpen} onRequestClose={closeModal} transaction={modal.data} />}
        </div>
    );
}
