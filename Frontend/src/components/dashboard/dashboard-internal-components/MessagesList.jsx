import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from "@iconify/react";
import { AuthContext } from "../../../store/authContext";
import { useSocket } from '../../../store/socketContext';
import MessagesFilterBtns from "./MessagesFilterBtns";
import DisplayMessageDetails from "../../modals/DisplayMessageDetails";
import ReplyMessageModal from "../../modals/ReplyMessageModal";
import DeleteMessageModal from "../../modals/DeleteMessageModal";
import { markMessage } from "../../../utils/asyncUtils/markMessage";
import { messagesStates, tableHeader } from "../../../utils/arraysUtils/messagesMapArrays";
import LoadingModal from "../../modals/LoadingModal";
import { formatDbDate } from "../../../utils/formattingUtils/formatDateToDisplay";
import { mapArray, filterArray } from "../../../utils/arraysUtils/arraysFunctions";

export default function MessagesList({ userMessages, messagesError, loading, getMessages, messagesPages }) {
    const { filter } = useParams();
    const { user } = useContext(AuthContext);
    const { connected, messages: socketMessages } = useSocket();
    const [modal, setModal] = useState({ isOpen: false, type: null, message: null });
    const [messagesType, setMessagesType] = useState(filter || "all");
    const [newMessages, setNewMessages] = useState([]);
    const navigate = useNavigate();

    const liveMessages = connected && socketMessages && socketMessages.newMessages || [];
    const sortedMessages = Array.isArray(userMessages) ? userMessages.sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
    const filteredMessages = Array.isArray(userMessages) && filterArray(userMessages, (msg) => msg.recipient === user.userName);

    useEffect(() => {
        const newMessagesSet = new Set(mapArray(newMessages, (msg) => msg.id));
        const uniqueMessages = filterArray(liveMessages, (message) => !newMessagesSet.has(message.id));

        if (uniqueMessages.length > 0) {
            setNewMessages((prevMessages) => [...uniqueMessages, ...prevMessages]);
        };

        if (filterMap[filter]) {
            setMessagesType(filter);
        } else {
            navigate('/dashboard/messages/all', { replace: true });
        }


    }, [liveMessages, filter, navigate]);


    const handleChangeFilter = (type) => {
        navigate(`/dashboard/messages/${type}`);
    }

    const filterMap = {
        all: sortedMessages,
        new: newMessages,
        readed: filterArray(filteredMessages, (msg) => msg.readed === 1),
        sended: filterArray(sortedMessages, (msg) => msg.sender === user.userName),
    };

    const handleOpenModal = (type, message = null) => {
        setModal({ isOpen: true, type, message });
    };

    const handleCloseModal = () => {
        setModal({ isOpen: false, type: null, message: null });
    };

    const handleMarkMessage = (message) => markMessage(message, user, refreshData);

    return (
        <div className="mx-auto min-h-full">
            {userMessages && < MessagesFilterBtns messagesStates={messagesStates} handleChangeFilter={handleChangeFilter} />}
            {!loading ? (
                <>
                    <div className="w-full h-fit flex justify-end mb-2 pr-8">
                        {Array.from({ length: messagesPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => getMessages(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
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
                                    <td className="min-w-full py-2 whitespace-nowrap text-center">{formatDbDate(message.date)}</td>
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
                </>
            ) : (
                <p className="w-full h-fit flex justify-center text-2xl">
                    <span>Nie udało się pobrać wiadomości.</span>
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
            {loading && <LoadingModal isOpen={loading} />}
        </div>
    );
}


