import { useContext } from "react"
import { AuthContext } from '../../../store/authContext';
import { Link } from "react-router-dom"

export default function DashBoardMenu() {
    const { user, isAuthenticated } = useContext(AuthContext);

    const linksElements = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: 'myprofile', label: 'My profile' },
        { path: 'myhouse', label: 'My house' },
        { path: 'messages', label: 'Messages' },
        { path: 'housemates', label: 'Housemates' },
        { path: 'transactions', label: 'Transactions' },
        { path: 'calendar', label: 'Calendar' },
    ];

    return (
        <div id='dashboardMenu' className="w-fit bg-customGray flex flex-col justify-start items-center text-slate-300 pt-[3.5rem] gap-12">
            <ul className="w-full h-full flex flex-col items-center gap-6 px-12">
                {linksElements.map((link, index) => (
                    <li key={index}><Link to={link.path}>{link.label}</Link></li>
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
