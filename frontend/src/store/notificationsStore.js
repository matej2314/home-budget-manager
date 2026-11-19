import { create } from 'zustand';
import fetchData from '../utils/asyncUtils/fetchData';
import sendRequest from '../utils/asyncUtils/sendRequest';
import { apiBaseUrl } from '../url';

const useNotificationsStore = create((set) => ({
  notifications: {
    transactions: [],
    usersActions: [],
    monthlyBalance: [],
  },
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchData(`${apiBaseUrl}/notice/collection`);
      set((state) => {
        const updated = { ...state.notifications };
        (response.notifications || []).forEach((notification) => {
          const { category, noticeData } = notification;
          if (noticeData && category) {
            updated[category] = [...(updated[category] || []), noticeData];
          }
        });
        return { notifications: updated, loading: false };
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addNotification: (category, notification) =>
    set((state) => ({
      notifications: {
        ...state.notifications,
        [category]: [...(state.notifications[category] || []), notification],
      },
    })),

  removeNotification: async (category, notificationId) => {
    set({ loading: true, error: null });
    try {
      await sendRequest('DELETE', { noticeId: notificationId }, `${apiBaseUrl}/notice`);
      set((state) => ({
        notifications: {
          ...state.notifications,
          [category]: (state.notifications[category] || []).filter((n) => n.id !== notificationId),
        },
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));

export default useNotificationsStore;
export { useNotificationsStore };
