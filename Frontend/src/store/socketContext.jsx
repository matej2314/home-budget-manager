import { createContext, useState, useEffect, useContext } from "react";
import { socketPath } from '../url';

export const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);


    const initializeSocket = () => {
        const socketUrl = socketPath;
        const ws = new WebSocket(socketUrl);

        ws.onopen = () => {
            setConnected(true);
            console.log("WebSocket connected");
        };

        ws.onmessage = (event) => {

            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        ws.onerror = (error) => {
            setError(error.message);
            console.error("WebSocket Error:", error);
        };

        ws.onclose = () => {
            setConnected(false);
            console.log("WebSocket disconnected");
        };

        setSocket(ws);
    };

    const sendMessage = (message) => {

        if (socket && connected) {
            socket.send(message);
        } else {
            setError("WebSocket is not connected");
        }
    };

    const closeSocket = () => {
        if (socket) {
            socket.closeSocket();
        }
    };

    useEffect(() => {

        initializeSocket();


        return () => {
            closeSocket();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, connected, messages, sendMessage, error }}>
            {children}
        </SocketContext.Provider>
    );
};
