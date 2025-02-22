import { useContext } from 'react';
import { Link, useLocation } from "react-router-dom"
import { Icon } from '@iconify/react';
import { AuthContext } from '../../../store/authContext';
import { useSocket } from '../../../store/socketContext';
import NotificationDot from "../dashboard-internal-components/NotificationDot";
import { linksElements, adminLinksElements } from '../../../utils/arraysUtils/dashBoardMenuArrays';
import { locationEffect } from '../../../utils/locationEffect';

export default function DashBoardMenu() {
    const { messages, error } = useSocket();
    const { user, isAuthenticated } = useContext(AuthContext);
    const location = useLocation();

    const newMessages = !error && messages.newMessages;

    return (
        <div id='dashboardMenu' className="w-fit bg-customGray flex flex-col justify-start items-stretch text-slate-300 gap-12 px-7 border-r-2 border-slate-900 pt-10">
            <ul className="h-full flex flex-col items-center justify-start gap-6">
                {linksElements.map((link, index) => (
                    <li
                        key={index}
                        className={`w-full h-fit flex flex-row justify-center items-center border-b-2 border-slate-300/15 pb-5 hover:text-slate-400 gap-3 ${locationEffect(link, location)}`}
                    >
                        <Icon icon={link.icon} width={23} height={23} />
                        <Link to={link.path}>{link.label}</Link>
                        {link.dot && newMessages?.length > 0 ? <NotificationDot color={'bg-green-700'} data={newMessages.length} /> : null}
                    </li>
                ))}
                {isAuthenticated && user.role === 'superadmin' && <>
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
                }
            </ul>

        </div>
    )
}
