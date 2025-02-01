import { useContext } from 'react';
import { AuthContext } from '../../../store/authContext';
import { useSocket } from '../../../store/socketContext';
import { Link } from "react-router-dom"
import { Icon } from '@iconify/react';
import NotificationDot from "../dashboard-internal-components/NotificationDot";


export default function DashBoardMenu() {
    const { messages, error } = useSocket();
    const { user, isAuthenticated } = useContext(AuthContext);

    const newMessages = !error && messages.newMessages;

    const linksElements = [
        { path: '/dashboard', label: 'Dashboard', icon: 'carbon:dashboard-reference' },
        { path: 'myprofile', label: 'My profile', icon: 'healthicons:ui-user-profile' },
        { path: 'myhouse', label: 'My house', icon: 'uil:house-user' },
        { path: 'messages', label: 'Messages', icon: 'flowbite:messages-solid', dot: true, },
        { path: 'housemates', label: 'Housemates', icon: 'la:user-friends' },
        { path: 'transactions', label: 'Transactions', icon: 'tdesign:undertake-transaction' },
        { path: 'calendar', label: 'Calendar', icon: 'famicons:calendar-outline' },
    ];

    return (
        <div id='dashboardMenu' className="w-fit bg-customGray flex flex-col justify-start items-stretch text-slate-300 pt-[2.3rem] gap-12 px-7 border-r-2 border-slate-900">
            <ul className="h-full flex flex-col items-center gap-6">
                {linksElements.map((link, index) => (
                    <li
                        key={index}
                        className="w-full h-fit flex flex-row justify-center items-center border-b-2 border-slate-300/15 pb-5 hover:text-slate-400 gap-3"
                    >
                        <Icon icon={link.icon} width={23} height={23} />
                        <Link to={link.path}>{link.label}</Link>
                        {link.dot && newMessages.length > 0 ? <NotificationDot color={'bg-green-700'} data={newMessages.length} /> : null}
                    </li>
                ))}
                {isAuthenticated && user.role === 'superadmin' && <>
                    <li><Link to='users'>Users (if superadmin)</Link></li>
                    <li><Link to='households'>Households(if superadmin)</Link></li>
                    <li><Link to='stats'>Page stats(if superadmin)</Link></li>
                    <li><Link to='actioncats'>Actions cats (if superadmin)</Link></li>
                </>
                }
            </ul>
        </div>
    )
}
