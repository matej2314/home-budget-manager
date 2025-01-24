import { createContext, useState, useEffect } from "react";
import { useSocket } from './socketContext';
import sendWebSocketMessage from '../utils/sendWebSocketMessage';

const MessageContext = createContext({
    messages: [],
    isLoading: false,
    error: null,
    sendMessage: () => { },
    fetchMessages: () => { },
    markAsRead: () => { },
    deleteMessage: () => { },
});

const MessageProvider = ({ children }) => {
    const { socket, connected } = useSocket();
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (data) => {
            try {
                const parsedMessage = JSON.parse(data);
                const { type, message, data: msgData } = parsedMessage;

                switch (type) {
                    case 'newMessage':
                        setMessages((prevMessages) => [...prevMessages, message]);
                        break;
                    case 'messages':
                        setMessages(msgData);
                        break;
                    case 'error':
                        setError(msgData);
                        break;
                    case 'read':
                        setMessages((prevMessages) => [...prevMessages, message]);
                        break;
                    case 'delMsg':
                        setMessages((prevMessages) => [...prevMessages, message]);
                        break;
                    default:
                        console.log(`Nieznany typ wiadomości: ${type}`);
                };
            } catch (error) {
                setError(error.message);
                console.error("Błąd przetwarzania wiadomości:", error);
            }
        };

        socket.on('message', handleMessage);

        return () => {
            socket.off('message', handleMessage);
        };
    }, [socket]);

    const sendMessage = (message) => {
        sendWebSocketMessage(socket, connected, 'send', message, setError);
    };

    const fetchMessages = (userId) => {
        sendWebSocketMessage(socket, connected, 'fetch', { userId }, setError);
    };

    const markAsRead = (msgId) => {
        sendWebSocketMessage(socket, connected, 'read', { msgId }, setError);
    };

    const deleteMessage = (msgId) => {
        sendWebSocketMessage(socket, connected, 'delMsg', { msgId }, setError);
    };

    return (
        <MessageContext.Provider value={{
            messages,
            isLoading: false,
            error,
            sendMessage,
            fetchMessages,
            markAsRead,
            deleteMessage
        }}>
            {children}
        </MessageContext.Provider>
    );
};

export default MessageProvider;
