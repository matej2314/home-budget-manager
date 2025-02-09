import { useState, useEffect } from "react";
import { useSocket } from "../../../store/socketContext";
import { Link } from "react-router-dom";
import NotificationDot from "./NotificationDot";
import { Icon } from '@iconify/react';
import NotificationsContainer from "./NotificationsContainer";

export default function HeaderIconsContainer({ filteredDataMessages, socketMessages }) {
    const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
    const [isNotifications, setIsNotifications] = useState(false);
    const { connected, messages, error } = useSocket();
    const notifications = !error && connected && messages.notifications ? messages.notifications : {};

    const toggleNotifications = () => {
        setIsNotificationsVisible(prevState => !prevState);
    };

    const checkNotifications = () => {
        return Object.values(notifications).some(category => category.length > 0);
    };

    const handleReadedNotification = () => {
        setIsNotifications(false);
    };

    useEffect(() => {
        const hasNotifications = checkNotifications();
        setIsNotifications(hasNotifications);
    }, [notifications]);

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
            {socketMessages.length > 0 && (
                <NotificationDot
                    color="bg-green-700"
                    data={socketMessages.length}
                    head={true}
                />
            )}
            <Link to="/dashboard/messages" title="Messages" className="w-fit h-fit hover:text-sky-700">
                <Icon icon="tabler:messages" width={20} height={20} />
            </Link>
            <Link to="/dashboard/myhouse" title="My house" className="w-fit h-fit hover:text-yellow-900">
                <Icon icon="ph:house-bold" width={20} height={20} />
            </Link>
            {isNotificationsVisible && <NotificationsContainer onClick={handleReadedNotification} />}
        </div>
    );
}
