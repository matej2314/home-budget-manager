import { createContext, useState, useEffect } from "react";
import { useSocket } from './socketContext';
import sendWebSocketMessage from '../utils/sendWebSocketMessage';

export const MessageContext = createContext({
    messages: [],
    isLoading: false,
    error: null,
});

const MessageProvider = ({ children }) => {
    const { socket, connected } = useSocket();
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (rawMessage) => {
            try {
                const messageArray = JSON.parse(rawMessage);
                const { type, data } = messageArray;

                setError(null);

                switch (type) {
                    case 'newMessage':
                        setMessages((prevMessages) => [...prevMessages, messageArray]);
                        break;
                    case 'balance_update':
                        console.log('messageArray balance_update:', messageArray);
                        setMessages((prevMessages) => [...prevMessages, messageArray]);
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

    return (
        <MessageContext.Provider value={{
            messages,
            connected,
            isLoading: false,
            error,
        }}>
            {children}
        </MessageContext.Provider>
    );
};

export default MessageProvider;
