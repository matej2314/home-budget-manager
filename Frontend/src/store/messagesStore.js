import { create } from 'zustand';
import { serverUrl } from '../url';
import fetchData from '../utils/fetchData';

export const useMessagesStore = create((set) => ({
    messagesData: [],
    messaagesLoading: false,
    messagesError: null,
    messagesTotalPages: 1,
    currentPage: 1,
    isMessagesFetched: false,


    fetchMessages: async (page = 1) => {
        set({ messaagesLoading: true, messagesError: null, isMessagesFetched: false });

        try {
            const result = await fetchData(`${serverUrl}/board/data/messages/${page}`);
            set({
                messagesData: result.dashboardData.messagesData || [0],
                messagesTotalPages: result.dashboardData.totalPages || 1,
                currentPage: page,
                messagesLoading: false,
                isMessagesFetched: true,
            });
        } catch (error) {
            set({ messaagesLoading: false, messagesError: error });
        }
    },

    setCurrentPage: (page) => set({ currentPage: page }),
}));