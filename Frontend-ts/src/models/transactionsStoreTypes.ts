import { BaseApiResponse } from "@utils/asyncUtils/fetchData";

export type TotalPages = number;
export type Page = number;

export type NewActionData = {
    type: string;
    value: string;
    catId: string;
};

export type DeleteActionData = {
    transactionId: string;
};

export interface Transaction {
    transactionId: string;
    value: string;
    addedAt: string;
    type: string;
    userId: string;
    houseId: string;
    catId: string;
    categoryName: string;
    userName: string;
};

export type DashboardData = {
    actionsData: Transaction[] | [],
    totalPages: TotalPages,
    page: Page
};

export type Callbacks = {
    onSuccess?: () => void;
    onError?: () => void;
}

export interface TransactionsStoreType {
    actionsData: Transaction[] | [];
    actionsDataError: string | null;
    actionsLoading: boolean;
    currentPage: number;
    actionsTotalPages: number;
    isTransactionsFetched: boolean;
    fetchTransactions: (page: number) => Promise<void>;
    addTransaction: (newActionData: NewActionData, { onSuccess, onError }: Callbacks) => Promise<void>;
    deleteTransaction: (deleteActionData: DeleteActionData, { onSuccess, onError }: Callbacks) => Promise<void>;
    setCurrentPage: (page: number) => void;
};

export interface TransactionsApiResponse extends BaseApiResponse {
    dashboardData: DashboardData;
};
