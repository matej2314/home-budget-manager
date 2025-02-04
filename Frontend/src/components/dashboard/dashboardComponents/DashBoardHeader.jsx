import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { AuthContext } from '../../../store/authContext';
import { useSocket } from '../../../store/socketContext';
import { DataContext } from "../../../store/dataContext";
import LanguageSelector from "../dashboard-internal-components/LanguageSelector";
import { showInfoToast, showErrorToast } from '../../../configs/toastify';
import HeaderIconsContainer from "../dashboard-internal-components/HeaderIconsContainer";

export default function DashboardHeader() {
    const { user, error, logout, isAuthenticated } = useContext(AuthContext);
    const { connected, messages, error: SocketError } = useSocket();
    const [socketMessages, setSocketMessages] = useState([]);
    const { data, isLoading } = useContext(DataContext);
    const navigate = useNavigate();

    const dataMessages = isAuthenticated && data && !isLoading ? data.messagesData || [] : [];
    const filteredDataMessages = dataMessages.filter((message) => message.recipient === user.userName)
        .filter(message => message.readed === 0);

    const handleLogOut = async () => {
        try {
            await logout();
            showInfoToast('Użytkownik wylogowany!');
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            showErrorToast(`Błąd wylogowania: ${error.message}`);
        }
    };

    useEffect(() => {
        if (connected && !SocketError && messages) {
            const userMessages = messages.newMessages;

            if (userMessages.length > 0) {
                setSocketMessages(userMessages);
            };
        }
    }, [connected, SocketError, messages]);

    return (
        <div id='dashboard-header' className="w-full h-fit flex flex-row items-center text-slate-900 bg-slate-200 py-3 gap-5 border-2 border-b-slate-800/5 pl-5 pr-8">
            <div id="user-info" className="w-fit flex justify-around items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-full">
                    <p className="text-black flex justify-center items-center mt-3">photo</p>
                </div>
                {isAuthenticated && !error && user ? <p>{user.userName}</p> : <p>Guest</p>}
            </div>
            <HeaderIconsContainer filteredDataMessages={filteredDataMessages} socketMessages={socketMessages} />
            <div id="user-opts" className="w-full h-full flex justify-end items-center gap-4">
                <LanguageSelector />
                <button type="button" title="Logout" onClick={handleLogOut}><Icon icon='mdi:logout' width={20} height={20} /></button>
            </div>
        </div>
    )
}