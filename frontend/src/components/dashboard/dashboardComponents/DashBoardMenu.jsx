import { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../store/authContext';
import { useSocket } from '../../../store/socketContext';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDot from "../dashboard-internal-components/NotificationDot";
import OpenMenuButton from '../dashboard-internal-components/OpenMenuButton';
import { linksElements, adminLinksElements } from '../../../utils/arraysUtils/dashBoardMenuArrays';
import { locationEffect } from '../../../utils/locationEffect';

export default function DashBoardMenu() {
    const { messages, error } = useSocket();
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
    const { isMobile } = useIsMobile();
    const [isOpened, setIsOpened] = useState(false);
    const { t } = useTranslation("common");

    const handleToggleMenu = () => {
        setIsOpened(prevState => !prevState);
    };

    const newMessages = !error && messages.newMessages;

    return (
        <>
            {isMobile && <OpenMenuButton isOpened={isOpened} actionCallback={handleToggleMenu} />}
            <AnimatePresence>
                {isMobile && isOpened && (
                    <motion.button
                        type="button"
                        aria-label="Close menu overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-20 bg-black/40"
                        onClick={handleToggleMenu}
                    />
                )}
            </AnimatePresence>
            <motion.aside
                id='dashboardMenu'
                initial={{ opacity: 0, x: isMobile ? '-100%' : 0 }}
                animate={{ opacity: 1, x: isMobile && !isOpened ? '-100%' : 0 }}
                transition={{ type: 'tween', duration: 0.28 }}
                className={`bg-sidebar text-sidebar-muted flex flex-col justify-start items-stretch gap-8 border-r border-black/20 ${isMobile
                    ? 'fixed top-0 left-0 h-full w-[15.5rem] max-w-[85vw] pt-14 px-3 shadow-2xl z-30'
                    : 'sticky top-0 h-screen w-56 lg:w-60 shrink-0 pt-8 px-3 lg:px-4'
                    }`}
            >
                <div className="px-2 pb-2 border-b border-white/10">
                    <p className="text-white font-semibold text-sm tracking-wide">budgetApp</p>
                    <p className="text-[0.7rem] text-sidebar-muted mt-0.5">Household manager</p>
                </div>
                <nav className='h-full flex flex-col items-stretch justify-start gap-1 overflow-y-auto no-scrollbar pb-8'>
                    <ul className='w-full flex flex-col items-stretch justify-start gap-1'>
                        {linksElements.map((link, index) => (
                            <li key={index}>
                                <Link
                                    to={link.path}
                                    onClick={() => setIsOpened(false)}
                                    className={`w-full flex flex-row items-center gap-3 px-3 py-2.5 text-sm lg:text-[0.95rem] rounded-lg transition-colors duration-150 hover:bg-white/5 hover:text-white ${locationEffect(link, location) || 'text-sidebar-muted'}`}
                                >
                                    <Icon
                                        icon={link.icon}
                                        width={20}
                                        height={20}
                                        className="shrink-0 opacity-90"
                                    />
                                    <span className="flex-1 text-left">{t(`dashboardMenu.${link.label}`)}</span>
                                    {link.dot && newMessages?.length > 0 ? <NotificationDot color={'bg-emerald-500'} data={newMessages.length} /> : null}
                                </Link>
                            </li>
                        ))}
                        {isAuthenticated && user.role === 'superadmin' && (
                            <>
                                {adminLinksElements.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            to={link.path}
                                            onClick={() => setIsOpened(false)}
                                            className={`w-full flex flex-row items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors duration-150 hover:bg-white/5 hover:text-white ${locationEffect(link, location) || 'text-sidebar-muted'}`}
                                        >
                                            <Icon
                                                icon={link.icon}
                                                width={20}
                                                height={20}
                                                className="shrink-0"
                                            />
                                            <span>{t(`dashboardMenu.${link.label}`)}</span>
                                        </Link>
                                    </li>
                                ))}
                            </>
                        )}
                    </ul>
                </nav>
            </motion.aside>
        </>
    );
}
