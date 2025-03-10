import create from 'zustand';

const useNotificationsStore = create((set) => ({
    notifications: {
        transactions: [],
        usersActions: [],
        monthlyBalance: [],
    },
    addNotification: (category, notification) =>
        set((state) => {
            const updatedNotifications = { ...state.notifications };
            updatedNotifications[category] = [...updatedNotifications[category], notification];
            return { notifications: updatedNotifications };
        }),
    removeNotification: (category, notificationId) =>
        set((state) => {
            const updatedNotifications = { ...state.notifications };
            updatedNotifications[category] = updatedNotifications[category].filter(
                (notification) => notification.id !== notificationId
            );
            return { notifications: updatedNotifications };
        })
}));

export default useNotificationsStore;