import { BaseApiResponse } from "@utils/asyncUtils/fetchData";

type Message = {
    id: string;
    message: string;
    readed: boolean;
    date: string;
    sender: string;
    recipient: string;
};

type TotalPages = number;
type Page = number;

type DashboardData = {
    messagesData: Message[];
    totalPages: TotalPages;
    page: Page;
};

export type MessagesStoreType = {
    messagesData: Message[];
    messagesLoading: boolean;
    messagesError: string;
    messagesTotalPages: number;
    currentPage: number;
    isMessagesFetched: boolean;
    fetchMessages: (page: number) => Promise<void>;
    setCurrentPage: (page: number) => void;
}

export interface MessagesApiResponse extends BaseApiResponse {
    dashboardData: DashboardData;
};