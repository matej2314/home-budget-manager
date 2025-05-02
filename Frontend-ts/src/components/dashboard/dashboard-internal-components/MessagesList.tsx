import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from "@iconify/react";
import { useSocket } from '@store/socketContext';
import { useDeviceType } from "@hooks/useDeviceType";
import { useModal } from '@hooks/useModal';
import { useTranslation } from "react-i18next";
import { AuthContext } from "@store/authContext";
import { mapArray, filterArray } from "@utils/arraysUtils/arraysFunctions";
import { formatDbDate } from "@utils/formattingUtils/formatDateToDisplay";
import MessagesFilterBtns from "./MessagesFilterBtns";
import ModalComponent from '../dashboard-internal-components/ModalComponent';
import { DisplayMessageDetails, ReplyMessageModal, DeleteMessageModal } from '@components/modals/messagesModals/messagesModals';
import { markMessage } from "@utils/asyncUtils/markMessage";
import { messagesStates, tableHeader } from "@utils/arraysUtils/messagesMapArrays";
import LoadingModal from "../../modals/LoadingModal";
import { messagesBtnsArray } from "@utils/arraysUtils/messagesBtnsArray";
import { getFilterMap, getClickHandler, getMsgsModalComponents, normalizeMessages } from "@utils/messagesListUtils";
import { type Message } from "@models/messagesStoreTypes";
import { type MessageModalProps } from "@models/componentsTypes/modalsTypes";
import { NewMessageType } from "@models/socketContextTypes";

export type MessagesListInput = {
    userMessages: Message[],
    messagesError: unknown,
    loading: boolean;
    getMessages: (page: number) => Promise<void>;
    messagesPages: number;
}

export default function MessagesList({ userMessages, loading, getMessages, messagesPages }: MessagesListInput) {
    const { filter } = useParams<string>();
    const { user } = useContext(AuthContext)!;
    const { connected, messages: socketMessages } = useSocket();
    const { t: tInternal } = useTranslation("dashboardInternal");
    const { t: tUtils } = useTranslation("utils");
    const { modal, openModal, closeModal } = useModal<Message>({ isOpen: false, modalType: '', data: null });
    const [messagesType, setMessagesType] = useState<string>(filter || "all");
    const navigate = useNavigate();
    const { isMobile } = useDeviceType();


    const liveMessages: NewMessageType[] = (
        connected && socketMessages?.newMessages?.length ? socketMessages.newMessages : []
    );
    const normalizedLiveMessages = normalizeMessages(liveMessages);
    const sortedMessages = Array.isArray(userMessages) ? [...userMessages].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];

    const allMessages = [...sortedMessages, ...normalizedLiveMessages];

    const filterMap = getFilterMap(allMessages, user);


    useEffect(() => {
        if (filterMap[filter as string]) {
            setMessagesType(filter as string);
        } else {
            navigate('/dashboard/messages/all', { replace: true });
        }
    }, [normalizedLiveMessages, filter, navigate]);



    const handleChangeFilter = (type: string) => {
        navigate(`/dashboard/messages/${type}`);
    }

    const handleMarkMessage = (mode: string, message: Message) => {
        markMessage(message, user, getMessages, mode);
    }

    const handleOpenMessage = (actionType: string, message: Message) => {
        handleMarkMessage('open', message);
        openModal(actionType, message);
    }

    const modalComponents = getMsgsModalComponents(
        DisplayMessageDetails,
        DeleteMessageModal,
        ReplyMessageModal
    );

    return (
        <>
            <div className="w-full mx-auto min-h-full lg:px-3 xl:px-3">
                <div className="ml-5">
                    <MessagesFilterBtns messagesStates={messagesStates} handleChangeFilter={handleChangeFilter} />
                </div>

                {!loading ? (
                    filterMap[messagesType]?.length ? (
                        <>
                            <div className="w-full h-fit flex justify-end pr-6 my-2 gap-1">
                                {Array.from({ length: messagesPages }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => getMessages(index + 1)}
                                        className="bg-slate-200 px-2 py-1 rounded hover:bg-slate-300"
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                            <table className="messages-list-table">
                                <thead className="text-[0.6rem] indirect:text-sm md:text-base">
                                    <tr className="bg-slate-400">
                                        {tableHeader.map((header, index) => (
                                            <th
                                                key={index}
                                                className={`px-4 py-2 text-center ${index === 0 ? 'rounded-tl-xl' : ''} ${index === tableHeader.length - 1 ? 'rounded-tr-xl' : ''}`}
                                            >
                                                {tUtils(`tableHeader.${header}`)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="messages-list-table-body">
                                    {filterMap[messagesType].map((message, index) => (
                                        <tr
                                            key={message.id}
                                            className={`border-b border-slate-400 ${index === filterMap[messagesType].length - 1 ? 'border-b-[1px]' : ''} indirect:text-sm`}
                                        >
                                            <td className="messages-list-table-data">{message.sender}</td>
                                            <td className="messages-list-table-data">{message.recipient}</td>
                                            <td className="messages-list-table-data">{message.message}</td>
                                            <td className="messages-list-table-data">
                                                {!isMobile ? formatDbDate(message.date, undefined) : formatDbDate(message.date, true)}
                                            </td>
                                            <td className="messages-list-table-data">
                                                {message.readed ? tInternal("messagesList.readed") : tInternal("messagesList.unreaded")}
                                            </td>
                                            <td className="w-full flex justify-around items-center messages-list-table-data lg:flex lg:justify-center lg:gap-4 xl:flex xl:justify-start xl:gap-2 indirect:text-base md:text-lg pt-3 md:pt-2.5">
                                                {mapArray(
                                                    filterArray(messagesBtnsArray, item => item.condition === undefined || item.condition(message, user)),
                                                    ({ label, icon, actionType }) => (
                                                        <button
                                                            key={actionType}
                                                            onClick={getClickHandler(actionType, message, openModal, handleMarkMessage, handleOpenMessage)}
                                                            title={label}
                                                        >
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
                        <div className="flex justify-center text-xl my-4">
                            {tInternal("messagesList.noMessages")}
                        </div>
                    )
                ) : (
                    <p className="w-full h-fit flex justify-center text-2xl mt-10">
                        <span>{tInternal("messagesList.failedFetchError")}</span>
                    </p>
                )}

                {modal.isOpen && modal.modalType in modalComponents && (
                    <ModalComponent<MessageModalProps>
                        Component={modalComponents[modal.modalType]}
                        isOpen={modal.isOpen}
                        onRequestClose={closeModal}
                        props={{
                            data: modal.data as Message,
                            isOpen: modal.isOpen,
                            onRequestClose: closeModal,
                        }}
                    />
                )}
                {loading && <LoadingModal isOpen={loading} />}
            </div>
        </>
    );
}
