import { type Message } from "@models/messagesStoreTypes";


export interface BasicModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
};


export type MessageModalProps =  BasicModalProps & {
    data?: string | Message;
};