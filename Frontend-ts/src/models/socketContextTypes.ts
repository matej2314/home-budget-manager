import { ReactNode, Dispatch, SetStateAction } from "react"
import { Socket } from "socket.io-client";
import { type NotificationCategory, Notifications } from "./notificationsStoreTypes";

export type SetErrorType = Dispatch<SetStateAction<string | null>>;

export type SetConnectedType = Dispatch<SetStateAction<boolean>>;

export type SetMessagesType = Dispatch<SetStateAction<MessagesState>>;

export interface BalanceUpdateType {
    type: 'balance_update',
    data: {
        houseId: string;
        newBalance: string | number;
    }
};

export interface NewMessageType {
    type: 'newMessage',
    data: {
        id: string;
        sender: string;
        recipient: string;
        message: string;
        date: string;
        readed: boolean;
    }
};

export interface InitBudgetType {
    type: 'initial_budget',
    data: {
        id: string;
        category: 'initial_budget',
        initBudget: number;
        budgetPeriod: string;
        message: string;
    };
};

export interface InvitationSocketType {
    type: 'invitation',
    data: {
        invitationId: string;
        invitingUser: string;
        invitedUser: string;
    };
};

export interface MessageDataToSend {
    type: string;
    message: string;
};

export interface MessagesState {
    balanceUpdates: BalanceUpdateType[];
    newMessages: NewMessageType[];
    notifications: Notifications;
    initBudgets: InitBudgetType[];
    invitations: InvitationSocketType[];
}

export type SocketProviderProps = {
    children: ReactNode
};

export interface SocketContextType {
    socket: Socket | null;
    connected: boolean;
    messages: MessagesState;
    sendMessage: (type: string, message: MessageDataToSend) => void;
    error: string | null;
    deleteNotification: (
        notificationType: NotificationCategory,
        notificationId: string,
    ) => void;
}