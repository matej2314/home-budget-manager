import { create } from 'zustand';
import fetchData from '../utils/asyncUtils/fetchData';
import { serverUrl } from '../url';
import sendRequest from '../utils/asyncUtils/sendRequest';

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
            const response = await fetchData(`${serverUrl}/notice/collection`);

            if (response.status !== 'success') {
                throw new Error(response.message || 'Failed to fetch notifications.');
            }

            set((state) => {
                const updatedNotifications = { ...state.notifications };

                response.notifications.forEach(notification => {
                    const { category, noticeData } = notification;
                    if (noticeData && category) {
                        updatedNotifications[category] = [
                            ...(updatedNotifications[category] || []),
                            noticeData,
                        ];
                    }
                });

                return { notifications: updatedNotifications, loading: false };
            });
        } catch (error) {
            console.error(`Error fetching notifications: ${error}`);
            set({ error: error.message, loading: false });
        }
    },
    addNotification: (category, notification) =>
        set((state) => {
            const updatedNotifications = { ...state.notifications };
            updatedNotifications[category] = [...updatedNotifications[category], notification];
            return { notifications: updatedNotifications };
        }),

    removeNotification: async (category, notificationId) => {
        set({ laoding: true, error: false });
        try {
            const response = await sendRequest('DELETE', { noticeId: notificationId }, ` ${serverUrl}/notice`)

            if (response.status !== 'success') {
                console.error(`An error occured during remove notification : ${response.message}`);
            };

            set((state) => {
                const updatedNotifications = { ...state.notifications };
                updatedNotifications[category] = updatedNotifications[category].filter(
                    (notification) => notification.id !== notificationId
                );
                return { notifications: updatedNotifications };
            })
        } catch (error) {
            console.error(`An error occured during remove notification : ${error}`);
        }
    },
}));

export default useNotificationsStore;
