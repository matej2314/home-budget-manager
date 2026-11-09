import { useContext, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../../store/authContext';
import { useSocket } from '../../../store/socketContext';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { motion } from 'framer-motion';
import NotificationDot from "../dashboard-internal-components/NotificationDot";
import OpenMenuButton from '../dashboard-internal-components/OpenMenuButton';
import { linksElements, adminLinksElements } from '../../../utils/arraysUtils/dashBoardMenuArrays';
import { locationEffect } from '../../../utils/locationEffect';

export default function DashBoardMenu() {
    const { messages, error } = useSocket();
    const { user, isAuthenticated } = useContext(AuthContext);
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
            <motion.div
                id='dashboardMenu'
                initial={{ opacity: 0, x: isMobile ? '-100%' : 0 }}
                animate={{ opacity: 1, x: isMobile && !isOpened ? '-100%' : 0 }}
                transition={{ type: 'tween', duration: 0.3 }}
                className={`bg-customGray opacity-0 flex flex-col justify-start items-center text-slate-300 gap-12 pl-3 pr-3 lg:px-7 border-r-2 border-slate-900 ${isMobile ? 'fixed top-0 left-0 h-full w-[10rem] md:w-64 pt-4 shadow-lg z-10' : 'pt-9'}`}
            >
                <div className='h-full flex flex-col items-center justify-start gap-6'>
                    <ul className='w-full flex flex-col items-center justify-start gap-6'>
                        {linksElements.map((link, index) => (
                            <li
                                key={index}
                                className={`w-full h-fit flex flex-row justify-center text-nowrap items-center ${!isMobile ? 'text-base' : 'text-sm'} border-b-2 border-slate-300/15 pb-5 hover:text-slate-400 gap-3 ${locationEffect(link, location)}`}
                            >
                                <Icon
                                    icon={link.icon}
                                    width={23}
                                    height={23}
                                />
                                <Link
                                    to={link.path}
                                    onClick={() => setIsOpened(false)}
                                >
                                    {t(`dashboardMenu.${link.label}`)}
                                </Link>
                                {link.dot && newMessages?.length > 0 ? <NotificationDot color={'bg-green-700'} data={newMessages.length} /> : null}
                            </li>
                        ))}
                        {isAuthenticated && user.role === 'superadmin' && (
                            <>
                                {adminLinksElements.map((link, index) => (
                                    <li
                                        key={index}
                                        className={`w-full h-fit flex flex-row justify-center items-center border-b-2 border-slate-300/15 pb-5 hover:text-slate-400 gap-3 ${locationEffect(link, location)}`}
                                    >
                                        <Icon
                                            icon={link.icon}
                                            width={23}
                                            height={23}
                                        />
                                        <Link
                                            to={link.path}
                                        >
                                            {t(`dashboardMenu.${link.label}`)}
                                        </Link>
                                    </li>
                                ))}
                            </>
                        )}
                    </ul>
                </div>
            </motion.div>
        </>
    );
}
