import { useEffect } from 'react';
import { useTransactionsStore } from '../../../store/transactionsStore';
import { useTranslation } from 'react-i18next';
import TransactionsList from '../dashboard-internal-components/TransactionsList';

export default function LastTransactionsList({ limit }) {
    const { fetchTransactions, actionsLoading, actionsDataError, actionsData, isTransactionsFetched } = useTransactionsStore();
    const { t } = useTranslation("dashboardComponents");

    useEffect(() => {
        if (!isTransactionsFetched) {
            fetchTransactions();
        };
    }, [isTransactionsFetched, fetchTransactions]);

    return (
        <div id="lastActionsList" className="section-card flex flex-col gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-ink">{t("lastTransactions.heading")}</h2>
            <TransactionsList limit={limit} mainSite={true} transactions={!actionsLoading && !actionsDataError && actionsData} />
        </div>
    )
}
