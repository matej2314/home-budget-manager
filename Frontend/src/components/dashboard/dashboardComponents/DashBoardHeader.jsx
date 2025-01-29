import { useContext } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { AuthContext } from '../../../store/authContext';
import { DataContext } from "../../../store/dataContext";
import LanguageSelector from "../dashboard-internal-components/LanguageSelector";

export default function DashboardHeader() {
    const { user, error, logout } = useContext(AuthContext);
    const { data, isLoading } = useContext(DataContext);
    const navigate = useNavigate();

    const messages = data && !isLoading ? data.dashboardData.messagesData || [] : [];
    const filteredMessages = messages.filter((message) => message.recipient === user.userName);

    const handleLogOut = async () => {
        try {
            await logout();
            alert('Użytkownik wylogowany!');
            navigate('/');
        } catch (error) {
            console.log(`Błąd wylogowania: ${error.message}`);
        }
    };

    const handleChangeLang = (lang) => {
        setSelectedLang(lang);
    }

    return (
        <div id='dashboard-header' className="w-full h-fit flex flex-row items-center text-slate-900 bg-slate-200 py-3 pl-5 gap-5 border-2 border-b-slate-800/5">
            <div id="user-info" className="flex justify-around items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-full">
                    <p className="text-black flex justify-center items-center mt-3">photo</p>
                </div>
                {!error && user ? <p>{user.userName}</p> : <p>Guest</p>}
            </div>
            <div id="icons-container" className="flex justify-center items-center gap-2">
                <Link title='Notifications' className="w-fit h-fit hover:text-lime-700"><Icon icon='material-symbols:notifications-outline' width={20} height={20} /></Link>
                {filteredMessages && (
                    <span className="bg-red-700 w-4 h-4 rounded-full absolute top-[1.15rem] left-[26rem] text-white text-center text-xs flex items-center justify-center">
                        {filteredMessages.length}
                    </span>
                )}
                <Link to='/dashboard/messages' title="Messages" className="w-fit h-fit hover:text-sky-700"><Icon icon='tabler:messages' width={20} height={20} /></Link>
                <Link to='/dashboard/myhouse' title="My house" className="w-fit h-fit hover:text-yellow-900"><Icon icon='ph:house-bold' width={20} height={20} /></Link>
            </div>
            <div id="user-opts" className="w-full h-full flex justify-end items-center gap-4 mr-5">
                <p className="w-fit h-fit flex justify-center items-center">
                    Language :
                </p>
                <LanguageSelector />
                <button type="button" title="Logout" onClick={handleLogOut}><Icon icon='mdi:logout' width={20} height={20} /></button>
            </div>
        </div>
    )
}