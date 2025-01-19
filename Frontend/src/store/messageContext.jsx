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

        const handleMessage = (event) => {
            try {
                const parsedMessage = JSON.parse(event.data);
                const { type, message, data } = parsedMessage;


                switch (type) {
                    case 'newMessage':
                        setMessages((prevMessages) => [...prevMessages, message]);
                        break;
                    case 'messages':
                        setMessages(data);
                        break;
                    case 'error':
                        setError(data);
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
                setError(error);
                console.log(error);
            }
        };

        socket.addEventListener('message', handleMessage);

        return () => {
            socket.removeEventListener('message', handleMessage);
        }
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
            isLoading,
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