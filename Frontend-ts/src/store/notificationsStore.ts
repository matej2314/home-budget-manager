import { create } from 'zustand';
import fetchData, {type BaseApiResponse} from '../utils/asyncUtils/fetchData';

import { serverUrl } from '../url';
import sendRequest from '../utils/asyncUtils/sendRequest';
import { type NotificationsStoreType, NotificationsApiResponse, SendReqData } from '@models/notificationsStoreTypes';

const useNotificationsStore = create<NotificationsStoreType>((set) => ({
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
            const response = await fetchData<NotificationsApiResponse>(`${serverUrl}/notice/collection`);

            if (response.status !== 'success') {
                console.info(response.message || 'Failed to fetch notifications.');
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
        } catch (error: unknown) {
            const err = error as Error;
            console.info(`Error fetching notifications: ${error}`);
            set({ error: err.message, loading: false });
        }
    },
    addNotification: (category, notification) =>
        set((state) => {
            const updatedNotifications = { ...state.notifications };
            updatedNotifications[category] = [...updatedNotifications[category], notification];
            return { notifications: updatedNotifications };
        }),

    removeNotification: async (category, notificationId) => {
        set({ loading: true, error: null });
        try {
            const response = await sendRequest<SendReqData, BaseApiResponse>('DELETE', { noticeId: notificationId }, `${serverUrl}/notice`)

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