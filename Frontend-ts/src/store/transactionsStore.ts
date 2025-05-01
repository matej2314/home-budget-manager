import { create } from "zustand";
import { serverUrl } from "@configs/url";
import fetchData from "@utils/asyncUtils/fetchData";
import sendRequest from "@utils/asyncUtils/sendRequest";
import { type TransactionsStoreType, NewActionData, DeleteActionData, TransactionsApiResponse } from '@models/transactionsStoreTypes';
import { type BaseApiResponse } from "@utils/asyncUtils/fetchData";

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
    addTransaction: async (newActionData: NewActionData, {onSuccess ,onError}) => {
     const saveAction =  await sendRequest<NewActionData, BaseApiResponse>('POST', newActionData, `${serverUrl}/action/new`);

        if (saveAction.status === 'error') {
            if (onError) onError();
        } else if (saveAction.status === 'success') {
            if (onSuccess) onSuccess();
        }
    },
    deleteTransaction: async (deleteActionData: DeleteActionData, { onSuccess, onError }) => {
        const deleteAction = await sendRequest('DELETE', deleteActionData, `${serverUrl}/action`);
        
        if (deleteAction.status === 'error') {
            if (onError) onError();
        } else if (deleteAction.status === 'success') {
            if (onSuccess) onSuccess();
        };
    },
    setCurrentPage: (page) => set({ currentPage: page }),
}));