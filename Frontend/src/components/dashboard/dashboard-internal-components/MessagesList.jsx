import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Icon } from "@iconify/react";
import { DataContext } from "../../../store/dataContext";
import { AuthContext } from "../../../store/authContext";
import sendRequest from "../../../utils/sendRequest";
import DisplayMessageDetails from "../../modals/DisplayMessageDetails";
import ReplyMessageModal from "../../modals/ReplyMessageModal";
import DeleteMessageModal from "../../modals/DeleteMessageModal";
import { serverUrl } from "../../../url";
import { showInfoToast, showErrorToast } from '../../../configs/toastify';

export default function MessagesList() {
    const { filter } = useParams();
    const { data, isLoading, error, refreshData } = useContext(DataContext);
    const { user } = useContext(AuthContext);
    const [modal, setModal] = useState({ isOpen: false, type: null, message: null });
    const [messagesType, setMessagesType] = useState(filter || "all");
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        if (filterMap[filter]) {
            setMessagesType(filter);
        } else {
            navigate('/dashboard/messages/all', { replace: true });
        }
    }, [filter, navigate]);

    const handleChangeFilter = (type) => {
        navigate(`/dashboard/messages/${type}`);
    }

    const messagesStates = ['all', 'new', 'readed', 'sended'];
    const tableHeader = ["Sender", "Recipient", "Message", "Date", "Is readed", "Actions"];

    const messages = !isLoading && !error ? data.dashboardData.messagesData || [] : [];
    const sortedMessages = messages.sort((a, b) => new Date(b.date) - new Date(a.date));
    const filteredMessages = messages.filter((msg) => msg.recipient === user.userName);

    const filterMap = {
        all: sortedMessages,
        new: filteredMessages.filter((msg) => msg.readed === 0),
        readed: filteredMessages.filter((msg) => msg.readed === 1),
        sended: sortedMessages.filter((msg) => msg.sender === user.userName),
    };

    const handleOpenModal = (type, message = null) => {
        setModal({ isOpen: true, type, message });
    };

    const handleCloseModal = () => {
        setModal({ isOpen: false, type: null, message: null });
    };

    const handleMarkMessage = async (message) => {

        if (user.userName !== message.recipient) {
            showErrorToast('Nie jesteś odbiorcą tej wiadomości!');
            return;
        } else if (user.userName === message.recipient) {
            const markMessage = await sendRequest('PUT', { messageId: message.id }, `${serverUrl}/message/readed`);

            if (markMessage.status === 'error') {
                showErrorToast(markMessage.message);

            } else if (markMessage.status === 'success') {
                showInfoToast(markMessage.message);
                setTimeout(() => {
                    refreshData();
                }, 1000);
            };
        };
    };

    return (
        <div className="mx-auto min-h-full">
            {data && !isLoading && <div className="flex gap-3 mb-6">
                {messagesStates.map((type) => (
                    <button
                        key={type}
                        onClick={() => handleChangeFilter(type)}
                        className={`border-2 border-slate-300 text-slate-700 bg-slate-300/40 py-1 px-2 rounded-xl hover:bg-inherit
                             hover:text-slate-800 shadow-lg hover:shadow-sm ${location.pathname === `/dashboard/messages/${type}` ? 'bg-slate-400/80' : null}`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>}
            {!isLoading && !error ? (
                <table className="w-[80rem] h-full table-fixed border-collapse text-sm border-b-[1px] border-slate-400 rounded-b-xl">
                    <thead>
                        <tr className="border-b bg-slate-400">
                            {tableHeader.map((header, index) => (
                                <th key={index}
                                    className={`px-4 py-2 text-center 
                                    ${index === 0 ? 'rounded-tl-xl' : ''} 
                                    ${index === tableHeader.length - 1 ? 'rounded-tr-xl' : ''}`}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="border-x-[1px] border-slate-400">
                        {filterMap[messagesType]?.map((message) => (
                            <tr key={message.id}>
                                <td className="min-w-full py-2 whitespace-nowrap text-center">{message.sender}</td>
                                <td className="min-w-full py-2 whitespace-nowrap text-center">{message.recipient}</td>
                                <td className="min-w-full py-2 whitespace-nowrap text-center">{message.message}</td>
                                <td className="min-w-full py-2 whitespace-nowrap text-center">{message.date.split("T")[0]}</td>
                                <td className="min-w-full py-2 whitespace-nowrap text-center">{message.readed ? "Readed" : "Unreaded"}</td>
                                <td className="min-w-full py-2 flex items-center justify-center gap-3">
                                    <button onClick={() => handleOpenModal("details", message)} title="Open message">
                                        <Icon icon="lets-icons:message-open-light" width={20} height={20} />
                                    </button>
                                    <button
                                        title="Delete message"
                                        onClick={() => handleOpenModal('delete', message)}
                                    >
                                        <Icon icon="mdi-light:delete" width={22} height={22} />
                                    </button>
                                    <button
                                        title="Mark as readed"
                                        onClick={() => handleMarkMessage(message)}
                                    >
                                        <Icon icon="iconoir:mail-opened" width={20} height={20} />
                                    </button>
                                    {message.sender !== user.userName && <button onClick={() => handleOpenModal("reply", message)} title="Reply">
                                        <Icon icon="iconoir:reply-to-message" width={22} height={22} />
                                    </button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="w-full h-fit flex justify-center text-2xl">
                    {isLoading ? 'Ładowanie wiadomości...' : messages.length === 0 ? 'Brak wiadomości.' : null}
                </p>
            )}
            {modal.isOpen && modal.type === "details" && (
                <DisplayMessageDetails isOpen={modal.isOpen} onRequestClose={handleCloseModal} message={modal.message} />
            )}
            {modal.isOpen && modal.type === "reply" && (
                <ReplyMessageModal isOpen={modal.isOpen} onRequestClose={handleCloseModal} message={modal.message} />
            )}
            {modal.isOpen && modal.type === 'delete' && (
                <DeleteMessageModal isOpen={modal.isOpen} onRequestClose={handleCloseModal} message={modal.message} />
            )}
        </div>
    );
}
