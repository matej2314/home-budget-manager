import { useContext } from "react"
import { AuthContext } from '../../../store/authContext';
import { Link } from "react-router-dom"

export default function DashBoardMenu() {
    const { user, isAuthenticated } = useContext(AuthContext);

    return (
        <div id='dashboardMenu' className="w-[15rem] bg-customGray flex flex-col items-center justify-start text-slate-300 pt-5 gap-3">
            <div className="w-11/12 h-fit flex justify-end"><button>OP</button></div>
            <ul className="w-full h-full flex flex-col items-center gap-4">
                <li><Link to='/dashboard'>Dashboard</Link></li>
                <li><Link to='myhouse'>My house</Link></li>
                <li><Link to='messages'>Messages</Link></li>
                <li><Link to='housemates'>Housemates</Link></li>
                <li><Link to='transactions'>Transactions</Link></li>
                <li><Link to='calendar'>Calendar</Link></li>
                {user.role === 'superadmin' && <>
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