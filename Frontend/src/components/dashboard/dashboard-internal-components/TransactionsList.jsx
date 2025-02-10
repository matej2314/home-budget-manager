import { useContext, useEffect } from "react";
import { Icon } from '@iconify/react';
import { DataContext } from '../../../store/dataContext';
import sendRequest from '../../../utils/sendRequest';
import { serverUrl } from "../../../url";
import { showInfoToast, showErrorToast } from '../../../configs/toastify';
import LoadingModal from '../../modals/LoadingModal';

export default function TransactionsList({ limit, mainSite, filterId }) {
    const { fetchTransactions, actionsData, actionsError, actionsLoading, refreshData } = useContext(DataContext);

    const transactions = !actionsLoading && !actionsError && Array.isArray(actionsData) ? actionsData : [];
    const filteredTransactions = filterId ? [...transactions].filter((transaction) => transaction.userId === filterId) : transactions;
    const sortedTransactions = filteredTransactions.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
    const transactionsToDisplay = limit ? sortedTransactions.slice(0, limit) : sortedTransactions;


    const tableLabels = ['Value', 'Type', 'Category', 'User', 'Date'];

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleDeleteAction = async (transaction) => {
        try {
            const actionData = { transactionId: transaction.transactionId };
            const deleteAction = await sendRequest('DELETE', actionData, `${serverUrl}/action`);

            if (deleteAction.status === 'success') {
                showInfoToast('Transakcja usunięta.');
                refreshData();
            } else {
                showErrorToast('Nie udało się usunąć transakcji.');
            }
        } catch (error) {
            showErrorToast('Wystąpił błąd podczas usuwania transakcji.');
            console.error('Delete transaction error:', error);
        }
    };

    return (
        <div className="w-full h-full overflow-auto pb-4">
            {!actionsLoading && !actionsError ? (
                <table className={`${mainSite ? 'w-[97%] mx-auto' : 'w-full'} h-full table-fixed border-collapse text-sm border-b-[1px] border-slate-400 pb-6`}>
                    <thead>
                        <tr className={`border-b ${mainSite ? 'bg-slate-400/50' : 'bg-slate-400/80'}`}>
                            {tableLabels.map((label, index) => (
                                <th
                                    key={index}
                                    className={`px-4 py-2 text-left 
                                    ${index === 0 ? 'rounded-tl-xl' : ''} 
                                    ${mainSite && index === tableLabels.length - 1 ? 'rounded-tr-xl' : ''}`}
                                >
                                    {label}
                                </th>
                            ))}
                            {!mainSite && <th className="px-4 py-2 text-left rounded-tr-xl">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="border-x-[1px] border-slate-400">
                        {transactionsToDisplay.map((transaction) => (
                            <tr key={transaction.transactionId}
                                className={`border-b ${transaction.transactionId === transactionsToDisplay.length - 1 ? 'border-b-2 border-slate-400' : 'border-none'}`}>
                                <td className="px-4 py-2">{`${transaction.value} zł`}</td>
                                <td className="px-4 py-2">{transaction.type}</td>
                                <td className="px-4 py-2">{transaction.categoryName}</td>
                                <td className="px-4 py-2">{transaction.userName}</td>
                                <td className="px-4 py-2">{transaction.addedAt}</td>
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
        </div>
    );
}
