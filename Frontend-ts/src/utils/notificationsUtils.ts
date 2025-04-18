import { type NotificationsMap } from "@models/notificationsTypes";
import { type Notification } from "@models/notificationsTypes";

export const checkNotifications = (allNotifications: NotificationsMap) => {
    return Object.values(allNotifications).some(category => category.length > 0);
};

export const mergeNotifications = (storeNotifs: Notification[] = [], socketNotifs: Notification[] = []) => {
    const ids = new Set(storeNotifs.map(n => n.id));
    return [...storeNotifs, ...socketNotifs.filter(n => !ids.has(n.id))];
};