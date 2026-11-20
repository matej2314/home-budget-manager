import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../store/authContext';
import { useMessagesStore } from "../../../store/messagesStore";
import { useSocket } from '../../../store/socketContext';
import { useIsMobile } from '../../../hooks/useIsMobile';
import LanguageSelector from "../../LanguageSelector";
import { loggingOut } from "../../../utils/handleLogOut";
import HeaderIconsContainer from "../dashboard-internal-components/HeaderIconsContainer";
import LogOutModal from "../../modals/LogOutModal";
import { apiBaseUrl } from "../../../url";
import { filterArray } from '../../../utils/arraysUtils/arraysFunctions';

export default function DashboardHeader() {
    const { user, loginStatus, logout, isAuthenticated } = useAuth();
    const { connected, messages, error: SocketError } = useSocket();
    const { isMobile } = useIsMobile();
    const { t } = useTranslation("dashboardInternal");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const { messagesData: data, messagesLoading: isLoading } = useMessagesStore();
    const navigate = useNavigate();

    const dataMessages = isAuthenticated && data && !isLoading ? data.messagesData || [] : [];
    const filteredDataMessages = filterArray(dataMessages, (message) => message.recipient === user.userName)
        .filter(message => message.readed === 0);
    const socketMessages = (connected && !SocketError && messages?.newMessages) ? messages.newMessages : [];
    const unreadCount = filteredDataMessages.length + (socketMessages?.length || 0);
    const displayName = isAuthenticated && !loginStatus.error && user ? user.userName : 'Guest';

    useEffect(() => {
        if (!userMenuOpen) return;

        const handlePointerDown = (event) => {
            if (!userMenuRef.current?.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };
        const handleEscape = (event) => {
            if (event.key === 'Escape') setUserMenuOpen(false);
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [userMenuOpen]);

    const handleLogOut = async () => {
        await loggingOut(logout, navigate);
    };

    const handleOpenModal = () => {
        setUserMenuOpen(false);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const avatar = (
        <>
            <Icon icon="mdi:account" width={22} height={22} className="absolute" />
            <img
                src={user && `${apiBaseUrl}/avatars/avatar`}
                alt=""
                className="relative z-1 rounded-full w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.opacity = '0'; }}
            />
        </>
    );

    const mobileUserInfo = (
        <div id="user-info" className="flex-1 min-w-0 flex items-center gap-2 sm:gap-3">
            <div className="relative shrink-0" ref={userMenuRef}>
                <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                    aria-label="User menu"
                    onClick={() => setUserMenuOpen((open) => !open)}
                    className="relative w-10 h-10 shrink-0 bg-accent-soft rounded-full flex justify-center items-center overflow-hidden ring-2 ring-white shadow-sm text-accent"
                >
                    {avatar}
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 z-[2] min-w-4 h-4 px-1 rounded-full bg-rose-600 text-[0.65rem] leading-4 text-white text-center font-semibold">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
                {userMenuOpen && (
                    <div
                        role="menu"
                        className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-52 rounded-xl border border-slate-200 bg-surface shadow-[0_8px_24px_rgba(28,40,72,0.12)] p-1.5"
                    >
                        <Link
                            role="menuitem"
                            to="/dashboard/messages"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink hover:bg-page transition-colors"
                        >
                            <Icon icon="tabler:messages" width={18} height={18} className="text-muted" />
                            <span className="flex-1">{t("headerIcons.messagesTitle")}</span>
                            {unreadCount > 0 && (
                                <span className="min-w-5 h-5 px-1.5 rounded-full bg-rose-600 text-[0.7rem] leading-5 text-white text-center font-semibold">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>
                        <Link
                            role="menuitem"
                            to="/dashboard/myhouse"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink hover:bg-page transition-colors"
                        >
                            <Icon icon="ph:house-bold" width={18} height={18} className="text-muted" />
                            <span>{t("headerIcons.houseTitle")}</span>
                        </Link>
                    </div>
                )}
            </div>
            <p className="min-w-0 truncate font-medium text-sm sm:text-base">
                {displayName}
            </p>
        </div>
    );

    const desktopUserInfo = (
        <div id="user-info" className="relative shrink-0" ref={userMenuRef}>
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                aria-label="User menu"
                onClick={() => setUserMenuOpen((open) => !open)}
                className="max-w-[14rem] flex items-center gap-2 sm:gap-2.5 rounded-lg pl-0.5 pr-2 py-0.5 hover:bg-page transition-colors"
            >
                <span className="relative w-10 h-10 sm:w-7 sm:h-7 shrink-0 bg-accent-soft rounded-full flex justify-center items-center overflow-hidden ring-2 ring-white shadow-sm text-accent">
                    {avatar}
                </span>
                <span className="min-w-0 truncate font-medium text-sm sm:text-base text-left">
                    {displayName}
                </span>
                <Icon
                    icon="mdi:chevron-down"
                    width={18}
                    height={18}
                    className={`shrink-0 text-muted transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {userMenuOpen && (
                <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-48 rounded-xl border border-slate-200 bg-surface shadow-[0_8px_24px_rgba(28,40,72,0.12)] p-1.5"
                >
                    <button
                        type="button"
                        role="menuitem"
                        onClick={handleOpenModal}
                        className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink hover:bg-page transition-colors"
                    >
                        <Icon icon="mdi:logout" width={18} height={18} className="text-muted" />
                        <span>{t("headerIcons.logoutTitle")}</span>
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <header id='dashboard-header' className="sticky top-0 z-10 w-full min-w-0 flex items-center gap-2 sm:gap-3 text-ink py-3 sm:py-3.5 pl-14 pr-3 sm:pr-5 md:pl-5 lg:px-8 bg-surface/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_0_rgba(28,40,72,0.04)]">
            {isMobile ? mobileUserInfo : <div className="flex-1 min-w-0" />}
            <div id="user-opts" className="shrink-0 flex items-center gap-1.5 sm:gap-3">
                <HeaderIconsContainer filteredDataMessages={filteredDataMessages} socketMessages={socketMessages} />
                <LanguageSelector />
                {isMobile ? (
                    <button
                        type="button"
                        title={t("headerIcons.logoutTitle")}
                        onClick={handleOpenModal}
                        className="p-2 rounded-lg text-muted hover:text-accent hover:bg-accent-soft transition-colors"
                    >
                        <Icon icon='mdi:logout' width={20} height={20} />
                    </button>
                ) : (
                    desktopUserInfo
                )}
            </div>
            <LogOutModal isOpen={isModalOpen} onRequestClose={handleCloseModal} handleLogOut={handleLogOut} />
        </header>
    )
}
