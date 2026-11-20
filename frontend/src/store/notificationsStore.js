import { create } from 'zustand';
import fetchData from '../utils/asyncUtils/fetchData';
import sendRequest from '../utils/asyncUtils/sendRequest';
import { apiBaseUrl } from '../url';

const emptyNotifications = (notifications) =>
  Object.fromEntries(Object.keys(notifications).map((key) => [key, []]));

const useNotificationsStore = create((set, get) => ({
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

  clearAllNotifications: async () => {
    const { notifications } = get();
    const pendingIds = Object.values(notifications)
      .flat()
      .map((notice) => notice?.id)
      .filter(Boolean);

    if (pendingIds.length === 0) return;

    set({ loading: true, error: null });
    try {
      await Promise.all(
        pendingIds.map((id) =>
          sendRequest('DELETE', { noticeId: id }, `${apiBaseUrl}/notice`),
        ),
      );
      set((state) => ({
        notifications: emptyNotifications(state.notifications),
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
