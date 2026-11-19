import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from './authContext';
import { io } from "socket.io-client";
import { socketPath } from "../url";
import useNotificationsStore from './notificationsStore';

export const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    // ephemeral buffers for header UI; domain notifications live in notificationsStore
    const [messages, setMessages] = useState({
        balanceUpdates: [],
        newMessages: [],
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
                connectionStateRecovery: true,
                pingInterval: 15000,
                pingtTimeout: 5000,
            });

            newSocket.on("connect", () => {
                setConnected(true);
                console.log("Socket.IO connected");
            });

            newSocket.on("disconnect", () => {
                setConnected(false);
                console.log("Socket.IO disconnected");
            });

            newSocket.on("connect_error", (error) => {
                setError(error.message);
                console.error("Socket.IO Error:", error);
            });

            newSocket.on('error', (error) => {
                setError(error);
                console.error('Connection error:', error);
            });

            // shortcut: balance_update tylko bufor ephemeral; pełna synchronizacja board/transactions = major Faza 7, gdy BE emituje spójnie
            newSocket.on("balance_update", (data) => {
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    balanceUpdates: [data],
                }));
            });

            newSocket.on("initial_budget", (data) => {
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    initBudgets: [data],
                }));
            });

            newSocket.on("newMessage", (data) => {
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    newMessages: [...prevMessages.newMessages, data],
                }));
            });

            newSocket.on("invitation", (data) => {
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    invitations: [...prevMessages.invitations, data],
                }));
            });

            newSocket.on('notification', (data) => {
                const { category, ...noticeData } = data;

                if (!category) {
                    console.error("Notification category is missing:", data);
                    return;
                }

                const existing = useNotificationsStore.getState().notifications[category] || [];
                if (!existing.some((n) => n.id === noticeData.id)) {
                    useNotificationsStore.getState().addNotification(category, noticeData);
                }
            });

            // socket.io connection handle — external system subscription (react-hooks/set-state-in-effect)
            // eslint-disable-next-line react-hooks/set-state-in-effect -- store client from io()
            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
                setSocket(null);
                setConnected(false);
            };
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setConnected(false);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reconnect only on auth change
    }, [isAuthenticated]);

    const sendMessage = (type, message) => {
        if (socket && connected) {
            socket.emit(type, message);
        } else {
            setError("Socket.IO is not connected");
        }
    };

    return (
        <SocketContext.Provider value={{ socket, connected, messages, sendMessage, error }}>
            {children}
        </SocketContext.Provider>
    );
};
