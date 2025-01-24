import { createContext, useState, useEffect } from "react";
import { useSocket } from './socketContext';


export const MessageContext = createContext({
    messages: [],
    isLoading: false,
    error: null,
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
                const { type, message } = parsedMessage;

                switch (type) {
                    case 'newMessage':
                        setMessages((prevMessages) => [...prevMessages, message]);
                        break;
                    case 'error':
                        setError(message);
                        break;
                    case 'balance_update':
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
