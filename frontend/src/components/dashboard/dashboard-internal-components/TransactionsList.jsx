
import { useAuth } from '../../../store/authContext';
import useModal from '../../../hooks/useModal';
import { Icon } from '@iconify/react';
import { useMediaQuery } from 'react-responsive';
import LoadingModal from '../../modals/LoadingModal';
import { tableLabels } from '../../../utils/arraysUtils/actionsTableLabels';
import { formatDbDate } from '../../../utils/formattingUtils/formatDateToDisplay';
import { filterArray } from '../../../utils/arraysUtils/arraysFunctions';
import { useTranslation } from 'react-i18next';
import DeleteTransactionModal from '../../modals/DeleteTransactionModal';

export default function TransactionsList({ limit, mainSite, filterId, transactions, actionsLoading, actionsError, actionsTotalPages, currentPage = 1, getTransactions }) {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const { modal, openModal, closeModal } = useModal({ isOpen: false, type: 'delete', data: null });
    const { t: tInternal } = useTranslation("dashboardInternal");
    const { t: tUtils } = useTranslation("utils");
    const { user } = useAuth();

    const filteredTransactions = filterId ? filterArray(transactions, (transaction) => transaction.userId === filterId) : transactions;
    const sortedTransactions = Array.isArray(filteredTransactions)
        ? [...filteredTransactions].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
        : [];
    const transactionsToDisplay = limit ? sortedTransactions.slice(0, limit) : sortedTransactions;
    const showPagination = typeof getTransactions === 'function' && actionsTotalPages > 1;

    const handleDeleteAction = (transaction) => {
        openModal('delete', transaction);
    };

    return (
        <div className="w-full h-full overflow-auto pb-4">
            {showPagination && (
                <nav className="w-full flex flex-wrap justify-end items-center gap-1.5 mb-3" aria-label="Pagination">
                    {Array.from({ length: actionsTotalPages }, (_, index) => {
                        const page = index + 1;
                        const isActive = page === currentPage;
                        return (
                            <button
                                key={page}
                                type="button"
                                aria-label={`Page ${page}`}
                                aria-current={isActive ? 'page' : undefined}
                                disabled={isActive || actionsLoading}
                                onClick={() => getTransactions(page)}
                                className={`min-w-8 h-8 px-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-accent text-white shadow-sm cursor-default'
                                        : 'text-muted bg-surface border border-slate-200 hover:text-accent hover:border-accent/40 hover:bg-accent-soft'
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}
                </nav>
            )}
            {!actionsLoading && !actionsError ? (
                <table className={`${mainSite ? 'w-[97%] mx-auto' : 'w-full'} transactions-list-table`}>
                    <thead className='text-[0.65rem] indirect:text-sm md:text-sm text-muted'>
                        <tr className="border-b border-slate-100 bg-page">
                            {tableLabels.map((label, index) => (
                                <th
                                    key={index}
                                    className={`py-2.5 font-medium
                                    ${index === 0 ? 'rounded-tl-lg' : ''} 
                                    ${mainSite && index === tableLabels.length - 1 ? 'rounded-tr-lg' : ''}`}
                                >
                                    {tUtils(`actionsTableLabels.${label}`)}
                                </th>
                            ))}
                            {!mainSite && <th className="px-4 py-2.5 text-center rounded-tr-lg font-medium">{tInternal("transactionsList.actionsHeaderValue")}</th>}
                        </tr>
                    </thead>
                    <tbody className="text-[0.65rem] indirect:text-sm md:text-sm text-center text-ink">
                        {transactionsToDisplay.map((transaction) => (
                            <tr key={transaction.transactionId}
                                className="border-b border-slate-100 hover:bg-page/70 transition-colors">
                                <td className="pl-2 transactions-list-table-data font-medium">{`${transaction.value} zł`}</td>
                                <td className="transactions-list-table-data">{tInternal(`transactionsList.types.${transaction.type}`)}</td>
                                <td className="transactions-list-table-data">{transaction.categoryName}</td>
                                <td className="transactions-list-table-data">{transaction.userName}</td>
                                <td className="transactions-list-table-data">
                                    {!isMobile ? formatDbDate(transaction.addedAt) : formatDbDate(transaction.addedAt, 'split')}
                                </td>
                                {!mainSite && transaction.userName === user.userName && (
                                    <td>
                                        <button
                                            type="button"
                                            className="w-fit h-fit p-1.5 rounded-md text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                            onClick={() => handleDeleteAction(transaction)}
                                            title={tInternal("transactionsList.deleteBtnTitle")}
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
                <p>{tInternal("transactionsList.noActionsError")}</p>
            )}
            {actionsLoading && <LoadingModal isOpen={actionsLoading} />}
            {modal && modal.isOpen && modal.type === 'delete' && <DeleteTransactionModal isOpen={modal.isOpen} onRequestClose={closeModal} transaction={modal.data} />}
        </div>
    );
}
