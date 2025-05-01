import { BaseApiResponse } from "@utils/asyncUtils/fetchData";

export interface NotificationsMap {
    transactions: NoticeData[];
    usersActions: NoticeData[];
    monthlyBalance: NoticeData[];
};

export type NotificationCategory = 'transactions' | 'usersActions' | 'monthlyBalance';

export type NoticeData = {
    id: string;
    action: string;
    message: string;
    category: string;
};

export type Notification = {
    id: string;
    category: NotificationCategory;
    noticeData: NoticeData;
    houseId: string;
};

export type Notifications = Record<NotificationCategory, NoticeData[]>;

export type NotificationsStoreType = {
    notifications: Notifications;
    loading: boolean;
    error: string | null;
    fetchNotifications: () => Promise<void>;
    addNotification: (category: NotificationCategory, notification: NoticeData) => void;
    removeNotification: (category: NotificationCategory, notificationId: string) => Promise<void>;
};

export type NotificationsApiResponse = BaseApiResponse & {
    notifications: Notification[];
};

export type SendReqData = {
    noticeId: string;
};
