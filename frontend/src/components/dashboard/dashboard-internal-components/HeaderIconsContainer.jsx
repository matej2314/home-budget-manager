import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { checkNotifications } from "../../../utils/notificationsUtils";
import NotificationDot from "./NotificationDot";
import NotificationsContainer from "./NotificationsContainer";
import useNotificationsStore from "../../../store/notificationsStore";

export default function HeaderIconsContainer({ filteredDataMessages, socketMessages }) {
    const { t } = useTranslation("dashboardInternal");
    const { isMobile } = useIsMobile();
    const [isVisible, setIsVisible] = useState(false);
    const [ackedSocketMessages, setAckedSocketMessages] = useState(null);
    const { notifications, fetchNotifications, removeNotification } = useNotificationsStore();

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const hasNotifications = checkNotifications(notifications);
    const userMessages = ackedSocketMessages === socketMessages ? [] : (socketMessages || []);

    const toggleNotifications = () => {
        setIsVisible((prev) => !prev);
    };

    const handleReadNotification = async (type, id) => {
        await removeNotification(type, id);
    };

    const handleMessagesRead = () => {
        setAckedSocketMessages(socketMessages);
    };

    return (
        <div id="icons-container" className="relative w-fit flex justify-center items-center gap-1 sm:gap-2 text-muted">
            <button onClick={toggleNotifications} type="button" title={t("headerIcons.noticeTitle")} className="p-1.5 rounded-lg hover:text-accent hover:bg-accent-soft transition-colors">
                {hasNotifications ?
                    <Icon icon="ic:sharp-notifications-active" width={20} height={20} className="text-accent" />
                    : <Icon icon="material-symbols-light:notifications-outline" width={20} height={20} />
                }
            </button>
            {!isMobile && filteredDataMessages.length > 0 && (
                <NotificationDot color="bg-red-700" data={filteredDataMessages.length} head={true} />
            )}
            {!isMobile && userMessages.length > 0 && (
                <NotificationDot color="bg-green-700" data={userMessages.length} head={true} onClick={handleMessagesRead} />
            )}
            {!isMobile && (
                <>
                    <Link to="/dashboard/messages" title={t("headerIcons.messagesTitle")} className="p-1.5 rounded-lg hover:text-accent hover:bg-accent-soft transition-colors" onClick={handleMessagesRead}>
                        <Icon icon="tabler:messages" width={20} height={20} />
                    </Link>
                    <Link to="/dashboard/myhouse" title={t("headerIcons.houseTitle")} className="p-1.5 rounded-lg hover:text-accent hover:bg-accent-soft transition-colors">
                        <Icon icon="ph:house-bold" width={20} height={20} />
                    </Link>
                </>
            )}
            {isVisible && (
                <NotificationsContainer
                    notifications={notifications}
                    clickAction={handleReadNotification}
                />
            )}
        </div>
    );
}
