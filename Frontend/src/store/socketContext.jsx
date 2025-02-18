import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./authContext";
import { io } from "socket.io-client";
import { socketPath } from "../url";

export const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState({
        balanceUpdates: [],
        newMessages: [],
        notifications: {
            transactions: [],
            usersActions: [],
            monthlyBalance: []
        },
        initBudgets: [],
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
                pintTimeout: 5000,
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

            newSocket.on('notification', (data) => {
                setMessages((prevMessages) => {
                    const updatedNotifications = {
                        ...prevMessages.notifications,
                        transactions: Array.isArray(prevMessages.notifications.transactions)
                            ? [...prevMessages.notifications.transactions, data]
                            : [data],
                        usersActions: Array.isArray(prevMessages.notifications.usersActions)
                            ? [...prevMessages.notifications.usersActions, data]
                            : [data],
                        monthlyBalance: Array.isArray(prevMessages.notifications.monthlyBalance)
                            ? [...prevMessages.notifications.monthlyBalance, data]
                            : [data],
                    };

                    return {
                        ...prevMessages,
                        notifications: updatedNotifications,
                    };
                });
            });

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
    }, [isAuthenticated, socket]);

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
