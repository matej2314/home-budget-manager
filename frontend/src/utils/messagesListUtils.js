import { filterArray } from "./arraysUtils/arraysFunctions"

export const getFilterMap = (sortedMessages, newMessages, filteredMessages, user) => {

    return {
        all: sortedMessages,
        new: newMessages,
        readed: filterArray(filteredMessages, (msg) => msg.readed === 1),
        sended: filterArray(sortedMessages, (msg) => msg.sender === user.userName),
    };
};

export const getClickHandler = (actionType, message, openModal, handleMarkMessage, handleOpenMessage) => {
    switch (actionType) {
        case 'open':
            return () => handleOpenMessage('open', message);
        case 'delete':
            return () => openModal('delete', message);
        case 'mark':
            return () => handleMarkMessage(message, 'mark');
        case 'reply':
            return () => openModal('reply', message);
    };
};

export const getModalComponents = (DisplayMessageDetails, DeleteMessageModal, ReplyMessageModal) => {
    return {
        open: DisplayMessageDetails,
        delete: DeleteMessageModal,
        reply: ReplyMessageModal,
    };
}