import { type Message } from "@utils/arraysUtils/messagesBtnsArray";
import { type NewMessageType } from "@models/socketContextTypes";

export type HeaderIconsContainerInput = {
    filteredDataMessages: Message[];
    socketMessages: NewMessageType[] | undefined;
};


export type NotificationsState = {
    isVisible: boolean;
    hasNotifications: boolean;
};

export type UserMessagesType = {
    userMessages:  NewMessageType[];
};
