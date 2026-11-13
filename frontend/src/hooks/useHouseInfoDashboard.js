import { useContext, useEffect, useMemo } from 'react';
import { DataContext } from '../store/dataContext';
import { AuthContext } from '../store/authContext';
import { useTransactionsStore } from '../store/transactionsStore';
import useProcessedData from './useProcessedData';
import { getData } from '../utils/getData';

/** Orkiestracja danych widoku house info — bez reguł uprawnień jako SoT. */
export default function useHouseInfoDashboard() {
  const { data, isLoading, error: contextError } = useContext(DataContext);
  const { actionsLoading, actionsDataError, actionsData, isTransactionsFetched, fetchTransactions } =
    useTransactionsStore();
  const { user } = useContext(AuthContext);
  const { houseData, houseMates, statsData, dailyData } = data;

  useEffect(() => {
    if (!isTransactionsFetched) {
      fetchTransactions();
    }
  }, [isTransactionsFetched, fetchTransactions]);

  const basicHouseInfo = (!isLoading && !contextError && houseData[0]) || [];
  const dailyInfo = getData(isLoading, contextError, true, dailyData, []);
  const stats = getData(isLoading, contextError, true, statsData, []);
  const matesData = getData(isLoading, contextError, true, houseMates, []);
  const transactions = (!actionsDataError && !actionsLoading && isTransactionsFetched && actionsData) || [];

  const { actionCountLabels } = useMemo(() => {
    if (!stats || !stats.length) {
      return { actionCountLabels: [] };
    }
    return {
      actionCountLabels: stats.map(
        (item) => `${item.countStartDate} - ${item.monthlyBalanceDate}`,
      ),
    };
  }, [stats]);

  const { labels, monthlyBalances, definedBudgets, monthlyTransactionCounts } = useProcessedData(stats, {
    labels: 'monthlyBalanceDate',
    monthlyBalances: 'monthlyBalanceValue',
    definedBudgets: 'definedMonthlyBudgets',
    monthlyTransactionCounts: 'transactionCount',
  });

  const { actionLabels, dailyTransactions, dailyBudgetLabels, dailyBudgetValues } = useProcessedData(
    dailyInfo,
    {
      actionLabels: 'dailyActionsDate',
      dailyTransactions: 'dailyActionCount',
      dailyBudgetLabels: 'dailyBudgetDate',
      dailyBudgetValues: 'dailyBudgetValue',
    },
  );

  return {
    user,
    isLoading,
    houseMates,
    basicHouseInfo,
    dailyInfo,
    matesData,
    transactions,
    actionsData,
    chartMonthly: { labels, monthlyBalances, definedBudgets, monthlyTransactionCounts, actionCountLabels },
    chartDaily: { actionLabels, dailyTransactions, dailyBudgetLabels, dailyBudgetValues },
  };
}
