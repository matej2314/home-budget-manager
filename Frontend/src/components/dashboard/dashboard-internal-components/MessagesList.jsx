import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from "@iconify/react";
import { useSocket } from '../../../store/socketContext';
import { useIsMobile } from '../../../hooks/useIsMobile';
import useModal from '../../../hooks/useModal';
import { useTranslation } from "react-i18next";
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
    const { t: tInternal } = useTranslation("dashboardInternal");
    const { t: tUtils } = useTranslation("utils");
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

    const handleOpenMessage = (actionType, message) => {
        handleMarkMessage(message);
        openModal(actionType, message);
    }

    const getClickHandler = (actionType, message) => {
        switch (actionType) {
            case 'open':
                return () => handleOpenMessage('open', message);
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
            {userMessages && <div className="mx-auto min-h-full lg:px-3 xl:px-3">
                <div className="ml-5">
                    <MessagesFilterBtns messagesStates={messagesStates} handleChangeFilter={handleChangeFilter} />
                </div>
                {!loading ? (
                    <>
                        <div className="w-full h-fit flex justify-end pr-6">
                            {Array.from({ length: messagesPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => getMessages(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        <table className="messages-list-table">
                            <thead className="text-[0.6rem] indirect:text-sm md:text-base">
                                <tr className=" bg-slate-400">
                                    {tableHeader.map((header, index) => (
                                        <th key={index}
                                            className={`px-4 py-2 mr-2 text-center
                                    ${index === 0 ? 'rounded-tl-xl' : ''}
                                    ${index === tableHeader.length - 1 ? 'rounded-tr-xl' : ''}`}
                                        >
                                            {tUtils(`tableHeader.${header}`)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="messages-list-table-body">
                                {filterMap[messagesType]?.map((message, index) => (
                                    <tr
                                        key={message.id}
                                        className={`border-b border-slate-400 ${index === filterMap[messagesType].length - 1 ? 'border-b-[1px]' : ''} indirect:text-sm`}>
                                        <td className="messages-list-table-data indirect:text-base">{message.sender}</td>
                                        <td className="messages-list-table-data">{message.recipient}</td>
                                        <td className="messages-list-table-data">{message.message}</td>
                                        <td className="messages-list-table-data">
                                            {!isMobile ? formatDbDate(message.date) : formatDbDate(message.date, 'split')}
                                        </td>
                                        <td className="messages-list-table-data">{message.readed ? tInternal("messagesList.readed") : tInternal("messagesList.unreaded")}</td>
                                        <td
                                            className="w-full flex justify-around items-center messages-list-table-data lg:flex lg:justify-start lg:gap-8 xl:flex xl:justify-start xl:gap-2 indirect:text-base md:text-lg pt-3 md:pt-2.5"
                                        >
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
                        <span>{tInternal("messagesList.failedFetchError")}</span>
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


