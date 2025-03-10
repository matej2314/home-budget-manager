import { useState, useEffect } from "react";
import { useSocket } from "../../../store/socketContext";
import { Link } from "react-router-dom";
import { Icon } from '@iconify/react';
import NotificationDot from "./NotificationDot";
import NotificationsContainer from "./NotificationsContainer";

export default function HeaderIconsContainer({ filteredDataMessages, socketMessages }) {
    const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
    const [isNotifications, setIsNotifications] = useState(false);
    const [userMessages, setUserMessages] = useState([]);
    const { connected, messages, error, removeNotification } = useSocket();
    const notifications = (connected && !error && messages && messages.notifications) || [];

    const toggleNotifications = () => {
        setIsNotificationsVisible(prevState => !prevState);
    };

    const checkNotifications = () => {
        return Object.values(notifications).some(category => category.length > 0);
    };

    const handleReadNotification = (type, id) => {
        setIsNotifications(false);
        removeNotification(type, id)
    };

    useEffect(() => {
        const hasNotifications = checkNotifications();
        setIsNotifications(hasNotifications);

        if (socketMessages) {
            setUserMessages(socketMessages);
        }
    }, [notifications, socketMessages]);

    const handleMessagesRead = () => {
        setUserMessages([]);
    }

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
            {isNotificationsVisible && <NotificationsContainer notifications={notifications} clickAction={handleReadNotification} />}
        </div>
    );
}
