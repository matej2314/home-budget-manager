import { createContext, useState, useEffect, useContext} from "react";
import { AuthContext } from "./authContext";
import { io, type Socket } from 'socket.io-client';
import { socketPath } from "url";
import { handleSetConnected, handleSocketError } from "@utils/socketUtils/defaultSocketMessagesHandlers";
import { handleBalanceUpdate, handleInitBudget, handleNewMessage, socketInvitationHandler, socketNotificationHandler } from "@utils/socketUtils/socketMessagesHandlers";
import { type NotificationCategory, Notification } from "@models/notificationsStoreTypes";
import {type  MessagesState, SocketProviderProps, SocketContextType, BalanceUpdateType, InitBudgetType, NewMessageType, MessageDataToSend, InvitationSocketType } from "@models/socketContextTypes";

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("usesocket must be used within a SocketProvider");
    }
    return context;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext)!;
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<MessagesState>({
        balanceUpdates: [],
        newMessages: [],
        notifications: {
            transactions: [],
            usersActions: [],
            monthlyBalance: [],
        },
        initBudgets: [],
        invitations: [],
    });

    useEffect(() => {
        if (isAuthenticated) {
            const newSocket = io(socketPath, {
                transports: ["websocket"],
                withCredentials: true,
                reconnection: true,
                reconnectionDelay: 3000,
                reconnectionAttempts: 5,
            });

            newSocket.on("connect", () => handleSetConnected(true, setConnected));

            newSocket.on("disconnect", () => handleSetConnected(false, setConnected));

            newSocket.on("connect_error", (error: Error) => handleSocketError(error, setError));

            newSocket.on("error", (error: any) => handleSocketError(error, setError));

            newSocket.on("balance_update", (data: BalanceUpdateType) => {
                handleBalanceUpdate(data, setMessages);
            });

            newSocket.on("initial_budget", (data: InitBudgetType) => {
                handleInitBudget(data, setMessages);
            });

            newSocket.on("newMessage", (data: NewMessageType) => {
                handleNewMessage(data, setMessages);
            });

            newSocket.on("invitation", (data: InvitationSocketType) => {
                socketInvitationHandler(data, setMessages);
            });

            newSocket.on("notification", (data: Notification) => {
                socketNotificationHandler(data, setMessages, messages);
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
                setSocket(null);
                setConnected(false);
            };
        } else if (socket) {
            socket.disconnect();
            setSocket(null);
            setConnected(false);
        }
    }, [isAuthenticated]);

    const sendMessage = (type: string, message: MessageDataToSend) => {
        if (socket && connected) {
            socket.emit(type, message);
        } else {
            setError("Socket.IO is not connected");
        };
    };

    const deleteNotification = (notificationType: NotificationCategory, notificationId: string) => {
        setMessages((prev) => {
            const updated = { ...prev.notifications };
            updated[notificationType] = updated[notificationType].filter(
                (n) => n.id !== notificationId
            );

            return {
                ...prev,
                notifications: updated,
            };
        });
    };

    const socketContextValue = {
        socket,
        connected,
        messages,
        sendMessage,
        error,
        deleteNotification,
    };

    return (
        <SocketContext.Provider value={socketContextValue}>
            {children}
        </SocketContext.Provider>
    )
}

