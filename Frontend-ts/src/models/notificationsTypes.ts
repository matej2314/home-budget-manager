export interface NoticeData {
    id: string;
    action: string;
    message: string;
    category: string;
};


export interface Notification {
    id: string;
    category: string;
    noticeData: NoticeData;
};

export interface NotificationsMap {
    transactions: Notification[];
    usersActions: Notification[];
    monthlyBalance: Notification[];
}