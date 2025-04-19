import { create } from "zustand";
import { serverUrl } from "url";
import fetchData from "@utils/asyncUtils/fetchData";
import { type TransactionsStoreType, TransactionsApiResponse } from '@models/transactionsStoreTypes';

export const useTransactionsStore = create<TransactionsStoreType>((set) => ({
    actionsData: [],
    actionsDataError: null,
    actionsLoading: false,
    currentPage: 1,
    actionsTotalPages: 0,
    isTransactionsFetched: false,

    fetchTransactions: async (page = 1) => {
        set({ actionsLoading: true, actionsDataError: null, isTransactionsFetched: false });

        try {
            const result = await fetchData<TransactionsApiResponse>(`${serverUrl}/board/data/transactions/${page}`);
            set({
                actionsData: result.dashboardData.actionsData,
                actionsTotalPages: result.dashboardData.totalPages || 1,
                currentPage: page,
                actionsLoading: false,
                isTransactionsFetched: true,
            });
        } catch (error: unknown) {
            const err = error as Error;
            set({ actionsLoading: false, actionsDataError: err.message });
        }
    },
    setCurrentPage: (page) => set({ currentPage: page }),
}));