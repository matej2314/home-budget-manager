import { type User } from "@models/authTypes";

export type Message = {
    id: string;
    sender: string;
    recipient: string;
    message: string;
    readed?: boolean
};

type BtnElement = {
    label: string;
    icon: string;
    actionType: string;
    condition?: (message: Message, user:User) => void;
}


export const messagesBtnsArray: BtnElement[] = [
    { label: 'Open message', icon: "lets-icons:message-open-light", actionType: 'open' },
    { label: 'Delete message', icon: "mdi-light:delete", actionType: 'delete' },
    { label: 'Mark as readed', icon: "iconoir:mail-opened", actionType: 'mark' },
    { label: 'Reply', icon: "iconoir:reply-to-message", actionType: 'reply', condition: (message, user) => message.sender !== user.userName },
];