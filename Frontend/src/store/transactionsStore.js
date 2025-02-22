import { create } from 'zustand';
import { serverUrl } from '../url';
import fetchData from '../utils/asyncUtils/fetchData';

export const useTransactionsStore = create((set) => ({
    actionsData: [],
    actionsDataError: null,
    actionsLoading: false,
    currentPage: 1,
    actionsTotalPages: 0,
    isTransactionsFetched: false,

    fetchTransactions: async (page = 1) => {
        set({ actionsLoading: true, actionsDataError: null, isTransactionsFetched: false });

        try {
            const result = await fetchData(`${serverUrl}/board/data/transactions/${page}`);
            set({
                actionsData: result.dashboardData.actionsData || [0],
                actionsTotalPages: result.dashboardData.totalPages || 1,
                currentPage: page,
                actionsLoading: false,
                isTransactionsFetched: true,
            });
        } catch (error) {
            set({ actionsLoading: false, actionsDataError: error });
        }
    },
    setCurrentPage: (page) => set({ currentPage: page }),
}));