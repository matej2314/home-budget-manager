import { useContext } from "react";
import { Icon } from '@iconify/react';
import { DataContext } from '../../store/dataContext';
import sendRequest from '../../utils/sendRequest';

export default function TransactionsList({ limit, mainSite }) {
    const { data, isLoading, error } = useContext(DataContext);

    const transactions = !isLoading && !error && data.dashboardData.actionsData || [];
    const sortedTransactions = transactions.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
    const transactionsToDisplay = limit ? sortedTransactions.slice(0, limit) : transactions;

    const handleDeleteAction = async (e) => {
        e.preventDefault();
    }

    return (
        <div className="w-full h-full overflow-auto">
            {!isLoading && !error ? (
                <table className="w-full h-full table-auto border-collapse text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="px-4 py-2 text-left">Value</th>
                            <th className="px-4 py-2 text-left">Type</th>
                            <th className="px-4 py-2 text-left">Category</th>
                            <th className="px-4 py-2 text-left">User</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            {mainSite === false && <th className="px-4 py-2 text-left">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {transactionsToDisplay.map((transaction, index) => (
                            <tr key={index} className="border-b">
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
                                            onClick={handleDeleteAction}
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
