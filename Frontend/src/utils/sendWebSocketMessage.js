const sendWebSocketMessage = (socket, connected, type, data, setError) => {
    if (socket && connected) {
        const messageData = { type, data };
        socket.emit(JSON.stringify(messageData));
    } else {
        setError('WebSocket is not connected');
    };
};

export default sendWebSocketMessage;