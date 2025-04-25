import { useEffect } from 'react';
import { useTransactionsStore } from '@store/transactionsStore';
import { useTranslation } from 'react-i18next';
import TransactionsList from '../dashboard-internal-components/TransactionsList';

interface LastTransactionsListProps {
    limit?: number;
};

export default function LastTransactionsList({ limit }: LastTransactionsListProps) {
    const { fetchTransactions, actionsLoading, actionsDataError, actionsData, isTransactionsFetched } = useTransactionsStore();
    const { t } = useTranslation("dashboardComponents");

    const transactions = !actionsDataError && !actionsLoading ? actionsData : [];

    useEffect(() => {
        if (!isTransactionsFetched) {
            fetchTransactions(1);
        };
    }, [isTransactionsFetched]);

    return (
        <div id="lastActionsList" className="h-fit flex flex-col justify-start rounded-md shadow-sm shadow-slate-500 my-4 gap-3 pt-2 pb-4">
            <h2 className="h-fit flex justify-center text-[1.22rem] text-slate-700">{t("lastTransactions.heading")}</h2>
            <TransactionsList limit={limit} mainSite={true} transactions={transactions} />
        </div>
    )
}