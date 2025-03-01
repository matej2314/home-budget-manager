import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from "@iconify/react";
import { useSocket } from '../../../store/socketContext';
import { useIsMobile } from '../../../hooks/useIsMobile';
import useModal from '../../../hooks/useModal';
import { AuthContext } from "../../../store/authContext";
import { mapArray, filterArray } from "../../../utils/arraysUtils/arraysFunctions";
import { formatDbDate } from "../../../utils/formattingUtils/formatDateToDisplay";
import MessagesFilterBtns from "./MessagesFilterBtns";
import ModalComponent from '../dashboard-internal-components/ModalComponent';
import { DisplayMessageDetails, ReplyMessageModal, DeleteMessageModal } from "../../modals/messagesModals/messagesModals";
import { markMessage } from "../../../utils/asyncUtils/markMessage";
import { messagesStates, tableHeader } from "../../../utils/arraysUtils/messagesMapArrays";
import LoadingModal from "../../modals/LoadingModal";
import { messagesBtnsArr } from "../../../utils/arraysUtils/messagesBtnsArray";

export default function MessagesList({ userMessages, messagesError, loading, getMessages, messagesPages }) {
    const { filter } = useParams();
    const { user } = useContext(AuthContext);
    const { connected, messages: socketMessages } = useSocket();
    const { modal, openModal, closeModal } = useModal({ isOpen: false, type: null, data: null });
    const [messagesType, setMessagesType] = useState(filter || "all");
    const [newMessages, setNewMessages] = useState([]);
    const navigate = useNavigate();
    const { isMobile } = useIsMobile();

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

    const refreshData = getMessages;
    const handleMarkMessage = (message) => markMessage(message, user, refreshData);

    const getClickHandler = (actionType, message) => {
        switch (actionType) {
            case 'open':
                return () => openModal('details', message);
            case 'delete':
                return () => openModal('delete', message);
            case 'mark':
                return () => handleMarkMessage(message);
            case 'reply':
                return () => openModal('reply', message);
        };
    };

    const modalComponents = {
        open: DisplayMessageDetails,
        delete: DeleteMessageModal,
        reply: ReplyMessageModal,
    };

    return (
        <>
            {userMessages && <div className="mx-auto min-h-full">
                <MessagesFilterBtns messagesStates={messagesStates} handleChangeFilter={handleChangeFilter} />
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
                        <table className=" w-fit mx-2 lg:w-[80rem] h-full table-fixed border-collapse text-xs lg:text-base rounded-b-xl">
                            <thead className="text-[0.6rem] indirect:text-sm md:text-base">
                                <tr className=" bg-slate-400">
                                    {tableHeader.map((header, index) => (
                                        <th key={index}
                                            className={`px-4 py-2 mr-2 text-center
                                    ${index === 0 ? 'rounded-tl-xl' : ''}
                                    ${index === tableHeader.length - 1 ? 'rounded-tr-xl' : ''}`}
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="w-full border-x-[1px] border-slate-400 text-[0.6rem] indirect:text-sm md:text-base">
                                {filterMap[messagesType]?.map((message, index) => (
                                    <tr
                                        key={message.id}
                                        className={`border-b border-slate-400 ${index === filterMap[messagesType].length - 1 ? 'border-b-[1px]' : ''} indirect:text-sm`}>
                                        <td className="px-4 py-2 text-center indirect:text-base">{message.sender}</td>
                                        <td className="px-4 py-2 text-center">{message.recipient}</td>
                                        <td className="px-4 py-2 text-center">{message.message}</td>
                                        <td className="px-4 py-2 text-center">
                                            {!isMobile ? formatDbDate(message.date) : formatDbDate(message.date, 'split')}
                                        </td>
                                        <td className="px-4 py-2 text-center">{message.readed ? "Readed" : "Unreaded"}</td>
                                        <td className="px-4 py-2 text-center flex justify-center items-center gap-2 indirect:text-base md:text-lg pt-3 md:pt-2.5">
                                            {mapArray(
                                                filterArray(messagesBtnsArr, item => item.condition === undefined || item.condition(message, user)),
                                                ({ label, icon, actionType }) => (
                                                    <button key={actionType} onClick={getClickHandler(actionType, message)} title={label}>
                                                        <Icon icon={icon} />
                                                    </button>
                                                )
                                            )}
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
                {modal.isOpen && <ModalComponent
                    Component={modalComponents[modal.type]}
                    isOpen={modal.isOpen}
                    onRequestClose={closeModal}
                    message={modal.data}
                />}
                {loading && <LoadingModal isOpen={loading} />}
            </div>}
        </>
    );
}


