import { create } from "zustand";
import { serverUrl } from "url";
import fetchData from "@utils/asyncUtils/fetchData";
import { type MessagesStoreType, MessagesApiResponse } from "@models/messagesStoreTypes";

export const useMessagesStore = create<MessagesStoreType>((set) => ({
    messagesData: [],
    messagesLoading: false,
    messagesError: '',
    messagesTotalPages: 1,
    currentPage: 1,
    isMessagesFetched: false,

    fetchMessages: async (page = 1) => {
        set({ messagesLoading: true, messagesError: '', isMessagesFetched: false });

        try {
            const result = await fetchData<MessagesApiResponse>(`${serverUrl}/board/data/messages/${page}`);
            set({
                messagesData: result.dashboardData.messagesData || [0],
                messagesTotalPages: result.dashboardData.totalPages || 1,
                currentPage: page,
                messagesLoading: false,
                isMessagesFetched: true,
            });
        } catch (error: unknown) {
            const err = error as Error;
            set({ messagesLoading: false, messagesError: err.message });
        }
    },
    setCurrentPage: (page) => set({ currentPage: page }),
}));