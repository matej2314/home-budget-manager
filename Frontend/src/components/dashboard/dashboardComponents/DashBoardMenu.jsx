import { useContext, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Icon } from '@iconify/react';
import { AuthContext } from '../../../store/authContext';
import { useSocket } from '../../../store/socketContext';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { motion } from 'framer-motion';
import NotificationDot from "../dashboard-internal-components/NotificationDot";
import { linksElements, adminLinksElements } from '../../../utils/arraysUtils/dashBoardMenuArrays';
import { locationEffect } from '../../../utils/locationEffect';

export default function DashBoardMenu() {
    const { messages, error } = useSocket();
    const { user, isAuthenticated } = useContext(AuthContext);
    const location = useLocation();
    const isMobile = useIsMobile();
    const [isOpened, setIsOpened] = useState(false);

    const handleToggleMenu = () => {
        setIsOpened(prevState => !prevState);
    };

    const newMessages = !error && messages.newMessages;

    return (
        <>
            {isMobile && (
                <motion.button
                    id='openMenuBtn'
                    initial={{ x: 0 }}
                    animate={{ x: isOpened ? '16rem' : 0 }}
                    transition={{ duration: 0.3, type: 'tween' }}
                    onDragStart={handleToggleMenu}
                    className={`absolute top-0 left-0 p-2 border-2 border-slate-300 text-slate-100 rounded-md bg-customGray z-20`}
                >
                    <div className='flex flex-col gap-1'>
                        <span className='w-5 h-0.5 bg-slate-100'></span>
                        <span className='w-5 h-0.5 bg-slate-100'></span>
                        <span className='w-5 h-0.5 bg-slate-100'></span>
                    </div>
                </motion.button>
            )}
            <motion.div
                id='dashboardMenu'
                initial={{ x: isMobile ? '-100%' : 0 }}
                animate={{ x: isMobile && !isOpened ? '-100%' : 0 }}
                transition={{ type: 'tween', duration: 0.3 }}
                className={`bg-customGray flex flex-col justify-start items-center text-slate-300 gap-12 pl-4 pr-4 lg:px-7 border-r-2 border-slate-900 ${isMobile ? 'fixed top-0 left-0 h-full w-64 pt-4 shadow-lg z-10' : 'pt-9'}`}
            >
                <div className='h-full flex flex-col items-center justify-start gap-6'>
                    <ul className='w-full flex flex-col items-center justify-start gap-6'>
                        {linksElements.map((link, index) => (
                            <li
                                key={index}
                                className={`w-full h-fit flex flex-row justify-center items-center ${!isMobile ? 'text-base' : 'text-sm'} border-b-2 border-slate-300/15 pb-5 hover:text-slate-400 gap-3 ${locationEffect(link, location)}`}
                            >
                                <Icon icon={link.icon} width={23} height={23} />
                                <Link to={link.path}>{link.label}</Link>
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
                                        <Icon icon={link.icon} width={23} height={23} />
                                        <Link to={link.path}>{link.label}</Link>
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
