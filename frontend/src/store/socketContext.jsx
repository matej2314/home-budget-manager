import { createContext, useState, useEffect, useContext, useRef } from "react";
import { useAuth } from './authContext';
import { io } from "socket.io-client";
import { socketPath } from "../url";
import useNotificationsStore from './notificationsStore';
import { useMessagesStore } from './messagesStore';
import { useInvitationsStore } from './invitationsStore';
import { notifyBoardRefresh } from '../utils/asyncUtils/boardRefreshBridge';
import { isHostRole } from '../utils/checkUserRole';

export const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const userRef = useRef(user);
    userRef.current = user;
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

            // Lifecycle Socket.io (nie są biznesowymi type z katalogu K-10)
            newSocket.on("connect", () => {
                setConnected(true);
                console.log("Socket.IO connected");
            });

            newSocket.on("disconnect", () => {
                setConnected(false);
                console.log("Socket.IO disconnected");
            });

            newSocket.on("connect_error", (err) => {
                setError(err.message);
                console.error("Socket.IO Error:", err);
            });

            // Katalog SERVER_SOCKET_EVENTS (K-10) — jawne on(...), bez dynamicznego on(any)
            newSocket.on('connect_success', () => {
                setConnected(true);
                setError(null);
            });

            newSocket.on('error', (payload) => {
                setError(payload?.message ?? payload);
                console.error('Connection error:', payload);
            });

            newSocket.on("balance_update", (data) => {
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    balanceUpdates: [data],
                }));
                notifyBoardRefresh('all');
            });

            newSocket.on("initial_budget", (data) => {
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    initBudgets: [data],
                }));
                notifyBoardRefresh('all');
            });

            newSocket.on("newMessage", (data) => {
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    newMessages: [...prevMessages.newMessages, data],
                }));
                const page = useMessagesStore.getState().currentPage || 1;
                useMessagesStore.getState().fetchMessages(page);
            });

            newSocket.on("invitation", (data) => {
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    invitations: [...prevMessages.invitations, data],
                }));
                const currentUser = userRef.current;
                if (isHostRole(currentUser)) {
                    useInvitationsStore.getState().fetchInvitations(currentUser);
                }
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

    // Brak katalogu emitów biznesowych z SPA (K-12 / F-9). Cykl życia = connect/disconnect biblioteki.
    return (
        <SocketContext.Provider value={{ socket, connected, messages, error }}>
            {children}
        </SocketContext.Provider>
    );
};
