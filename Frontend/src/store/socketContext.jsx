import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./authContext";
import { io } from "socket.io-client";
import { socketPath } from "../url";

export const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState({
        balanceUpdates: [],
        newMessages: [],
        notifications: {
            transactions: [],
            usersActions: [],
            monthlyBalance: []
        },
    });
    const [error, setError] = useState(null);
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        if (isAuthenticated) {
            const newSocket = io(socketPath, {
                transports: ["websocket"],
                withCredentials: true,
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

            newSocket.on("newMessage", (data) => {
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    newMessages: [...prevMessages.newMessages, data],
                }));
            });

            newSocket.on('notification', (data) => {

                if (data.category === 'transactions') {
                    setMessages((prevMessages) => ({
                        ...prevMessages,
                        notifications: {
                            ...prevMessages.notifications,
                            transactions: [...prevMessages.notifications.transactions, data],
                        },
                    }));

                } else if (data.category === 'usersActions') {
                    setMessages((prevMessages) => ({
                        ...prevMessages,
                        notifications: {
                            ...prevMessages.notifications,
                            usersActions: [...prevMessages.notifications.usersActions, data],
                        },
                    }));
                } else if (data.category === 'monthlyBalance') {
                    setMessages((prevMessages) => ({
                        ...prevMessages,
                        notifications: {
                            ...prevMessages.notifications,
                            monthlyBalance: [...prevMessages.notifications.monthlyBalance, data],
                        },
                    }));
                };
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
