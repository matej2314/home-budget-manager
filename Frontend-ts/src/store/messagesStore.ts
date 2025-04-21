import { create } from "zustand";
import { serverUrl } from "url";
import fetchData from "@utils/asyncUtils/fetchData";
import { type MessagesStoreType, MessagesApiResponse } from "@models/messagesStoreTypes";

export const useMessagesStore = create<MessagesStoreType>((set) => ({
    messagesData: [],
    messagesLoading: false,
    messagesError: null,
    messagesTotalPages: 1,
    currentPage: 1,
    isMessagesFetched: false,


    fetchMessages: async (page = 1) => {
        set({ messagesLoading: true, messagesError: null, isMessagesFetched: false });

        try {
            const result: MessagesApiResponse = await fetchData(`${serverUrl}/board/data/messages/${page}`);
            set({
                messagesData: result.dashboardData?.messagesData ,
                messagesTotalPages: result.dashboardData.totalPages || 1,
                currentPage: page,
                messagesLoading: false,
                isMessagesFetched: true,
            });
        } catch (error) {
            set({ messagesLoading: false, messagesError: error });
        }
    },

    setCurrentPage: (page) => set({ currentPage: page }),
}));