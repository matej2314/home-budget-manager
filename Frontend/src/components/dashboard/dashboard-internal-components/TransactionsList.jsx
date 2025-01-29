import { useContext } from "react";
import { Icon } from '@iconify/react';
import { DataContext } from '../../../store/dataContext';
import sendRequest from '../../../utils/sendRequest';
import { serverUrl } from "../../../url";

export default function TransactionsList({ limit, mainSite }) {
    const { data, isLoading, error, refreshData } = useContext(DataContext);

    const transactions = !isLoading && !error && data.dashboardData.actionsData || [];
    const sortedTransactions = transactions.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
    const transactionsToDisplay = limit ? sortedTransactions.slice(0, limit) : transactions;

    const tableLabels = ['Value', 'Type', 'Category', 'User', 'Date'];

    const handleDeleteAction = async (transaction) => {
        const actionData = {
            transactionId: transaction.transactionId,
        };

        const deleteAction = await sendRequest('DELETE', actionData, `${serverUrl}/action`);

        if (deleteAction.status === 'success') {
            alert('Transakcja usunięta.');
            refreshData();
        } else if (deleteAction.status === 'error') {
            alert('Nie udało się usunąć transakcji.');
        }
    }

    return (
        <div className="w-full h-full overflow-auto">
            {!isLoading && !error ? (
                <table className="w-full h-full table-auto border-collapse text-sm">
                    <thead>
                        <tr className="border-b">
                            {tableLabels.map((label, index) => (
                                <th key={index} className="px-4 py-2 text-left">{label}</th>
                            ))}
                            {mainSite === false && <th className="px-4 py-2 text-left">Actions</th>}
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
                                {mainSite === false && (
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
