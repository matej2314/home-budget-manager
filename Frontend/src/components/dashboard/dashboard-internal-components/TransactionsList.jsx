import { useContext } from "react";
import { Icon } from '@iconify/react';
import { DataContext } from '../../../store/dataContext';
import sendRequest from '../../../utils/sendRequest';
import { serverUrl } from "../../../url";
import { showInfoToast, showErrorToast } from '../../../configs/toastify';

export default function TransactionsList({ limit, mainSite, filterId }) {
    const { data, isLoading, error, refreshData } = useContext(DataContext);

    const transactions = !isLoading && !error && Array.isArray(data.dashboardData.actionsData) ? data.dashboardData.actionsData : [];
    const filteredTransactions = filterId ? [...transactions].filter((transaction) => transaction.userId === filterId) : transactions;
    const sortedTransactions = filteredTransactions.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
    const transactionsToDisplay = limit ? sortedTransactions.slice(0, limit) : sortedTransactions;


    const tableLabels = ['Value', 'Type', 'Category', 'User', 'Date'];

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
        <div className="w-full h-full overflow-auto">
            {!isLoading && !error ? (
                <table className="w-full h-full table-auto border-collapse text-sm">
                    <thead>
                        <tr className="border-b">
                            {tableLabels.map((label) => (
                                <th key={label} className="px-4 py-2 text-left">{label}</th>
                            ))}
                            {!mainSite && <th className="px-4 py-2 text-left">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {transactionsToDisplay.map((transaction) => (
                            <tr key={transaction.transactionId} className="border-b">
                                <td className="px-4 py-2">{`${transaction.value} zł`}</td>
                                <td className="px-4 py-2">{transaction.type}</td>
                                <td className="px-4 py-2">{transaction.categoryName}</td>
                                <td className="px-4 py-2">{transaction.userName}</td>
                                <td className="px-4 py-2">{transaction.addedAt.split('T')[0]}</td>
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
        </div>
    );
}
