import { useState, useEffect, useMemo } from "react";
import { useSocket } from "../../../store/socketContext";
import { Link } from "react-router-dom";
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import NotificationDot from "./NotificationDot";
import NotificationsContainer from "./NotificationsContainer";
import useNotificationsStore from "../../../store/notificationsStore";

export default function HeaderIconsContainer({ filteredDataMessages, socketMessages }) {
    const { t } = useTranslation("dashboardInternal");
    const [notificationsState, setNotificationsState] = useState({
        isVisible: false,
        hasNotifications: false,
    });
    const [userMessages, setUserMessages] = useState([]);
    const { connected, messages, error, deleteNotification } = useSocket();
    const { notifications, fetchNotifications, removeNotification } = useNotificationsStore();
    const socketNotifications = messages?.notifications || { transactions: [], usersActions: [], monthlyBalance: [] };

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const mergeNotifications = (storeNotifs = [], socketNotifs = []) => {
        const ids = new Set(storeNotifs.map(n => n.id));
        return [...storeNotifs, ...socketNotifs.filter(n => !ids.has(n.id))];
    };

    const allNotifications = useMemo(() => ({
        transactions: mergeNotifications(notifications.transactions, socketNotifications.transactions),
        usersActions: mergeNotifications(notifications.usersActions, socketNotifications.usersActions),
        monthlyBalance: mergeNotifications(notifications.monthlyBalance, socketNotifications.monthlyBalance),
    }), [notifications, socketNotifications]);

    const toggleNotifications = () => {
        setNotificationsState(prevState => ({
            ...prevState,
            isVisible: !prevState.isVisible,
        }));
    };

    const checkNotifications = () => {
        return Object.values(allNotifications).some(category => category.length > 0);
    };

    useEffect(() => {
        const hasNewNotifications = checkNotifications();
        setNotificationsState(prevState => ({
            ...prevState,
            hasNotifications: hasNewNotifications,
        }));

        if (socketMessages) {
            setUserMessages(socketMessages);
        }
    }, [allNotifications, socketMessages]);

    const handleReadNotification = async (type, id) => {
        await removeNotification(type, id);
        setNotificationsState(prevState => ({
            ...prevState,
            hasNotifications: false,
        }));
        await deleteNotification(type, id);
    };

    const handleMessagesRead = () => {
        setUserMessages([]);
    };

    return (
        <div id="icons-container" className="w-fit flex justify-center items-center gap-3">
            <button onClick={toggleNotifications} type="button" title={t("headerIcons.noticeTitle")} className="w-full h-full hover:text-lime-700">
                {notificationsState.hasNotifications ?
                    <Icon icon="ic:sharp-notifications-active" width={20} height={20} />
                    : <Icon icon="material-symbols-light:notifications-outline" width={20} height={20} />
                }
            </button>
            {filteredDataMessages.length > 0 && (
                <NotificationDot color="bg-red-700" data={filteredDataMessages.length} head={true} />
            )}
            {userMessages.length > 0 && (
                <NotificationDot color="bg-green-700" data={userMessages.length} head={true} onClick={handleMessagesRead} />
            )}
            <Link to="/dashboard/messages" title={t("headerIcons.messagesTitle")} className="w-fit h-fit hover:text-sky-700" onClick={handleMessagesRead}>
                <Icon icon="tabler:messages" width={20} height={20} />
            </Link>
            <Link to="/dashboard/myhouse" title={t("headerIcons.houseTitle")} className="w-fit h-fit hover:text-yellow-900">
                <Icon icon="ph:house-bold" width={20} height={20} />
            </Link>
            {notificationsState.isVisible && (
                <NotificationsContainer
                    notifications={allNotifications}
                    clickAction={handleReadNotification}
                    onClose={() => setNotificationsState(prevState => ({ ...prevState, isVisible: false }))}
                />
            )}
        </div>
    );
}
