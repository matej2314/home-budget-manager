import { filterArray } from "./arraysUtils/arraysFunctions";
import { type User } from "@models/authTypes";
import { type Message } from "@models/messagesStoreTypes";
import { type ActionType, type OpenModalFn, type HandleMessageFn } from "@models/msgsUtilsTypes";
import { MessageModalProps } from "@models/componentsTypes/modalsTypes";
import { ComponentType} from "react";
import { NewMessageType } from "@models/socketContextTypes";

export const getFilterMap = (sortedMessages: Message[], user: User): Record<string, Message[] > => {
    return {
        all: sortedMessages,
        new: filterArray(sortedMessages, (msg) => msg.readed === 0 as number),
        readed: filterArray(sortedMessages, (msg) => msg.readed === 1 as number),
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

export const getMsgsModalComponents = (
    DisplayMessageDetails: ComponentType<MessageModalProps>,
    DeleteMessageModal: ComponentType<MessageModalProps>,
    ReplyMessageModal: ComponentType<MessageModalProps>): Record<string, ComponentType<MessageModalProps>> => {

    return {
        open: DisplayMessageDetails,
        delete: DeleteMessageModal,
        reply: ReplyMessageModal
    };
};

export const normalizeMessages = (newMessages: NewMessageType[]): Message[] => {
    return newMessages
        .filter(msg => msg?.data)
        .map((msg): Message => ({
            ...msg.data,
        }));
};