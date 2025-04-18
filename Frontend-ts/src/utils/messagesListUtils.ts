import { filterArray } from "./arraysUtils/arraysFunctions";
import { type User } from "@models/authTypes";
import { type Message } from "./arraysUtils/messagesBtnsArray";
import { type ActionType, type OpenModalFn, type HandleMessageFn } from "@models/msgsUtilsTypes";
import { ReactNode } from "react";

export const getFilterMap = (sortedMessages: Message[], newMessages: Message[], filteredMessages: Message[], user: User) => {
    return {
        all: sortedMessages,
        new: newMessages,
        readed: filterArray(filteredMessages, (msg) => msg.readed === true),
        sended: filterArray(sortedMessages, (msg) => msg.sender === user.userName),
    };
};

export const getClickHandler = (
    actionType: ActionType,
    message: Message,
    openModal: OpenModalFn,
    handleMarkMessage: HandleMessageFn,
    handleOpenMessage: HandleMessageFn): (()=> void) | undefined => {
    switch (actionType) {
        case 'open':
            return () => handleOpenMessage('open', message);
        case 'delete':
            return () => openModal('delete', message);
        case 'mark':
            return () => handleMarkMessage('mark', message);
        case 'reply':
            return () => openModal('reply', message);
        default:
            return;
    };
};

export const getModalComponents = (DisplayMessageDetails: ReactNode, DeleteMessageModal: ReactNode, ReplyMessageModal: ReactNode) => {

    return {
        open: DisplayMessageDetails,
        delete: DeleteMessageModal,
        reply: ReplyMessageModal
    };
};