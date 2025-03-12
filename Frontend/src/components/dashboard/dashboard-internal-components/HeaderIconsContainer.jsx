import { useState, useEffect } from "react";
import { useSocket } from "../../../store/socketContext";
import { Link } from "react-router-dom";
import { Icon } from '@iconify/react';
import NotificationDot from "./NotificationDot";
import NotificationsContainer from "./NotificationsContainer";
import useNotificationsStore from "../../../store/notificationsStore";

export default function HeaderIconsContainer({ filteredDataMessages, socketMessages }) {
    const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
    const [isNotifications, setIsNotifications] = useState(false);
    const [userMessages, setUserMessages] = useState([]);

    const { connected, messages, error, deleteNotification } = useSocket();
    const { notifications, fetchNotifications, removeNotification } = useNotificationsStore();
    const socketNotifications = messages?.notifications || { transactions: [], usersActions: [], monthlyBalance: [] };

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const allNotifications = {
        transactions: [...(notifications.transactions || []), ...(socketNotifications.transactions || [])],
        usersActions: [...(notifications.usersActions || []), ...(socketNotifications.usersActions || [])],
        monthlyBalance: [...(notifications.monthlyBalance || []), ...(socketNotifications.monthlyBalance || [])],
    };

    const toggleNotifications = () => {
        setIsNotificationsVisible(prevState => !prevState);
    };

    const checkNotifications = () => {
        return Object.values(allNotifications).some(category => category.length > 0);
    };

    useEffect(() => {
        setIsNotifications(checkNotifications());

        if (socketMessages) {
            setUserMessages(socketMessages);
        }
    }, [allNotifications, socketMessages]);

    const handleReadNotification = async (type, id) => {
        await removeNotification(type, id);
        setIsNotifications(false);
        await deleteNotification(type, id);
    };

    const handleMessagesRead = () => {
        setUserMessages([]);
    };

    return (
        <div id="icons-container" className="w-fit flex justify-center items-center gap-3">
            <button onClick={toggleNotifications} type="button" title="Notifications" className="w-full h-full hover:text-lime-700">
                {isNotifications ?
                    <Icon icon="ic:sharp-notifications-active" width={20} height={20} />
                    : <Icon icon="material-symbols-light:notifications-outline" width={20} height={20} />
                }
            </button>
            {filteredDataMessages.length > 0 && (
                <NotificationDot
                    color="bg-red-700"
                    data={filteredDataMessages.length}
                    head={true}
                />
            )}
            {userMessages.length > 0 && (
                <NotificationDot
                    color="bg-green-700"
                    data={userMessages.length}
                    head={true}
                    onClick={handleMessagesRead}
                />
            )}
            <Link
                to="/dashboard/messages"
                title="Messages"
                className="w-fit h-fit hover:text-sky-700"
                onClick={handleMessagesRead}
            >
                <Icon icon="tabler:messages" width={20} height={20} />
            </Link>
            <Link to="/dashboard/myhouse" title="My house" className="w-fit h-fit hover:text-yellow-900">
                <Icon icon="ph:house-bold" width={20} height={20} />
            </Link>
            {isNotificationsVisible && <NotificationsContainer notifications={allNotifications} clickAction={handleReadNotification} />}
        </div>
    );
}
