import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../../../store/authContext';
import { useMessagesStore } from "../../../store/messagesStore";
import { useSocket } from '../../../store/socketContext';
import LanguageSelector from "../../LanguageSelector";
import { loggingOut } from "../../../utils/handleLogOut";
import HeaderIconsContainer from "../dashboard-internal-components/HeaderIconsContainer";
import LogOutModal from "../../modals/LogOutModal";
import { apiBaseUrl } from "../../../url";
import { filterArray } from '../../../utils/arraysUtils/arraysFunctions';

export default function DashboardHeader() {
    const { user, loginStatus, logout, isAuthenticated } = useAuth();
    const { connected, messages, error: SocketError } = useSocket();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { messagesData: data, messagesLoading: isLoading } = useMessagesStore();
    const navigate = useNavigate();

    const dataMessages = isAuthenticated && data && !isLoading ? data.messagesData || [] : [];
    const filteredDataMessages = filterArray(dataMessages, (message) => message.recipient === user.userName)
        .filter(message => message.readed === 0);
    const socketMessages = (connected && !SocketError && messages?.newMessages) ? messages.newMessages : [];

    const handleLogOut = async () => {
        await loggingOut(logout, navigate);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    return (
        <div id='dashboard-header' className="w-full h-fit flex flex-row items-center justify-between text-slate-900 py-3 border-b-2 border-slate-800/5 pl-5 pr-8">
            <div id="user-info" className="w-fit flex justify-around items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-full flex justify-center items-center">
                    <img src={user && `${apiBaseUrl}/avatars/avatar`} className="rounded-full w-full h-full" />
                </div>
                {isAuthenticated && !loginStatus.error && user ? <p>{user.userName}</p> : <p>Guest</p>}
                <HeaderIconsContainer filteredDataMessages={filteredDataMessages} socketMessages={socketMessages} />
            </div>
            <div id="user-opts" className="w-fit h-full flex justify-end items-center gap-4">
                <LanguageSelector />
                <button type="button" title="Logout" onClick={handleOpenModal}><Icon icon='mdi:logout' width={20} height={20} /></button>
            </div>
            <LogOutModal isOpen={isModalOpen} onRequestClose={handleCloseModal} handleLogOut={handleLogOut} />
        </div>
    )
}