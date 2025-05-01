import { type BalanceUpdateType, SetMessagesType, InitBudgetType, NewMessageType, InvitationSocketType, MessagesState } from "@models/socketContextTypes";
import { type Notification, NotificationCategory } from "@models/notificationsStoreTypes";
import useNotificationsStore from "@store/notificationsStore";

export const handleBalanceUpdate = (data: BalanceUpdateType, setMessages: SetMessagesType) => {
    setMessages((prev) => ({
        ...prev,
        balanceUpdates: [data],
    }));
};

export const handleInitBudget = (data: InitBudgetType, setMessages: SetMessagesType) => {
    setMessages((prev) => ({
        ...prev,
        initBudgets: [data],
    }));
};

export const handleNewMessage = (data: NewMessageType, setMessages: SetMessagesType) => {
    setMessages((prev) => ({
        ...prev,
        newMessages: [...prev.newMessages, data],
    }));
};

export const socketInvitationHandler = (data: InvitationSocketType, setMessages: SetMessagesType) => {
    setMessages((prev) => ({
        ...prev,
        invitations: [...prev.invitations, data],
    }));
};

export const socketNotificationHandler = (data: Notification, setMessages: SetMessagesType, messages: MessagesState) => {
    const { category, noticeData } = data;

    if (!category || !(category in messages.notifications)) {
        console.error("Notifications category is missing or invalid:", data);
        return;
    }

    setMessages((prev) => {
        const alreadyExists = prev.notifications[category as NotificationCategory]?.some(
            (n) => n.id === noticeData.id
        );

        if (!alreadyExists) {
            return {
                ...prev,
                notifications: {
                    ...prev.notifications,
                    [category]: [...prev.notifications[category], noticeData],
                },
            };
        }
        return prev;
    });

    const existingNotifications = useNotificationsStore.getState().notifications[category] || [];
    if (!existingNotifications.some((n) => n.id === noticeData.id)) {
        useNotificationsStore.getState().addNotification(category, noticeData);
    }
}