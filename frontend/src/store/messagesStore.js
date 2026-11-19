import { create } from 'zustand';
import { apiBaseUrl } from '../url';
import fetchData from '../utils/asyncUtils/fetchData';

export const useMessagesStore = create((set) => ({
    messagesData: [],
    messagesLoading: false,
    messagesError: null,
    messagesTotalPages: 1,
    currentPage: 1,
    isMessagesFetched: false,

    fetchMessages: async (page = 1) => {
        set({ messagesLoading: true, messagesError: null, isMessagesFetched: false });

        try {
            const result = await fetchData(`${apiBaseUrl}/board/data/messages/${page}`);
            set({
                messagesData: result.dashboardData.messagesData || [0],
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
