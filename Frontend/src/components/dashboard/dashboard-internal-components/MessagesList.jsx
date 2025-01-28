import { act, useContext, useState } from "react";
import { Icon } from '@iconify/react';
import { DataContext } from '../../../store/dataContext';
import DisplayMessageDetails from '../../modals/DisplayMessageDetails';
import SendMessageModal from '../../modals/SendMessageModal';

export default function MessagesList() {
    const { data, isLoading, error } = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [secondModalOpen, setSecondModalOpen] = useState(false);
    const [messagesType, setMessagesType] = useState('all');
    const [messageData, setMessageData] = useState({});
    const [actionType, setActionType] = useState(null);

    const messages = !isLoading && !error && data.dashboardData.messagesData || [];
    const sortedMessages = messages.sort((a, b) => new Date(b.date) - new Date(a.date))

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const closeSecondModal = () => {
        setSecondModalOpen(false);
    }

    const handleFilterMessages = (type) => {
        setMessagesType(() => type);
    };

    const handleShowMessage = (messageData, action) => {
        setMessageData(() => messageData);
        setActionType(() => action);
    };

    const handleReplyMessage = (action) => {
        setSecondModalOpen(true);
        setActionType(() => action);
    }


    let filteredMessages = [];

    if (messagesType === 'all') {
        filteredMessages = sortedMessages;
    } else if (messagesType === 'new') {
        filteredMessages = sortedMessages.filter((message) => message.readed == 0);
    } else if (messagesType === 'readed') {
        filteredMessages = sortedMessages.filter((message) => message.readed == 1);
    }

    return (
        <div className="w-full h-full overflow-auto">
            <div id='messBtns' className="w-full h-fit flex justify-start items-center gap-3">
                <>
                    <button
                        type="button"
                        onClick={() => handleFilterMessages('all')}
                        className={`w-fit h-fit flex justify-center items-center border-2 border-slate-300
                         text-slate-100 bg-slate-400/80 py-1 px-2 rounded-xl hover:bg-inherit hover:text-slate-800 shadow-lg hover:shadow-sm`}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        onClick={() => handleFilterMessages('new')}
                        className={`w-fit h-fit flex justify-center items-center border-2 border-slate-300
                         text-slate-100 bg-slate-400/80 py-1 px-2 rounded-xl hover:bg-inherit hover:text-slate-800 shadow-lg hover:shadow-sm`}
                    >
                        New
                    </button>
                    <button
                        type="button"
                        onClick={() => handleFilterMessages('readed')}
                        className={`w-fit h-fit flex justify-center items-center border-2 border-slate-300 text-slate-100 bg-slate-400/80 py-1 px-2
                         rounded-xl hover:bg-inherit hover:text-slate-800 shadow-lg hover:shadow-sm`}
                    >
                        Readed/Replied
                    </button>
                </>
            </div>
            {!isLoading && !error ? (
                <table className="w-full h-full table-auto border-collapse text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="px-4 py-2 text-left">Sender</th>
                            <th className="px-4 py-2 text-left">Recipient</th>
                            <th className="px-4 py-2 text-left">Message</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Is read</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredMessages.map((message) => (
                                <tr key={message.id} data-id={message.id} className="border-b">
                                    <td className="px-4 py-2">{message.sender}</td>
                                    <td className="px-4 py-2">{message.recipient}</td>
                                    <td className="px-4 py-2">{message.message}</td>
                                    <td className="px-4 py-2">{message.date.split('T')[0]}</td>
                                    <td className="px-4 py-2">{message.readed === 1 ? 'readed' : 'unreaded'}</td>
                                    <td className="px-4 py-2 flex items-center gap-3">{
                                        <>
                                            <button onClick={() => handleShowMessage(message, 'details')} id='openMessage' type="button" className="w-fit h-fit" title="Open message">
                                                <Icon icon='lets-icons:message-open-light' width={20} height={20} />
                                            </button>
                                            <button id="deleteBtn" type="button" value='delete message' title="Delete message" className="w-fit h-fit">
                                                <Icon icon='mdi-light:delete' width={22} height={22} />
                                            </button>
                                            <button id="markAsReadBtn" type="button" value='mark as readed' title="Mark as readed" className="w-fit h-fit">
                                                <Icon icon='iconoir:mail-opened' width={20} height={20} />
                                            </button>
                                            <button onClick={() => handleReplyMessage('reply')} id='replyToMessageBtn' type="button" value='reply' title="Reply to sender" className="w-fit h-fit">
                                                <Icon icon='iconoir:reply-to-message' width={22} height={22} />
                                            </button>
                                        </>

                                    }</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            ) : (
                <p>Brak wiadomości.</p>
            )}
            {actionType === 'details' && messageData && isModalOpen && <DisplayMessageDetails onRequestClose={handleCloseModal} message={messageData} isOpen={isModalOpen} />}
            {actionType === 'reply' && secondModalOpen && <SendMessageModal isOpen={secondModalOpen} onRequestClose={closeSecondModal} />}
        </div>
    )
};