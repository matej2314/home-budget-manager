import { type NoticeData} from "@models/notificationsStoreTypes";
import { type NotificationsMap } from "@models/notificationsStoreTypes";

export const checkNotifications = (allNotifications:NotificationsMap) => {
    return Object.values(allNotifications).some(category => category.length > 0);
};

export const mergeNotifications = (storeNotifs: NoticeData[] = [], socketNotifs: NoticeData[] = []) => {
    const ids = new Set(storeNotifs.map(n => n.id));
    return [...storeNotifs, ...socketNotifs.filter(n => !ids.has(n.id))];
};