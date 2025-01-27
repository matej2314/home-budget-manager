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
        <ul className="w-full h-fit flex flex-col items-center gap-2">
            {!isLoading && !error ? (
                transactionsToDisplay.map((transaction, index) => (
                    <li key={index} data-id={transaction.transactionId} className="w-full h-fit flex justify-center gap-2 border-b-[1px] border-slate-300 last:border-0 pb-2 px-2 last:pb-0" >
                        <span className="w-full flex justify-center gap-2">{`${transaction.value} zł`}</span>
                        <span className="w-full">{transaction.type}</span>
                        <span className="w-full">{transaction.categoryName}</span>
                        <span className="w-full">{transaction.userName}</span>
                        <span className="w-full">{transaction.addedAt.split('T')[0]}</span>
                        {!mainSite && <button type="button" className="w-fit h-fit" onClick={handleDeleteAction}><Icon icon='material-symbols:delete-outline' width={20} height={20} /></button>}
                    </li>
                ))
            ) : (
                <p>Brak transakcji</p>
            )}
        </ul>
    )
}