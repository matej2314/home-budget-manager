export const checkNotifications = (allNotifications) => {
    return Object.values(allNotifications).some(category => category.length > 0);
};

export const mergeNotifications = (storeNotifs = [], socketNotifs = []) => {
    const ids = new Set(storeNotifs.map(n => n.id));
    return [...storeNotifs, ...socketNotifs.filter(n => !ids.has(n.id))];
};