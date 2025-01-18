import { createContext } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serverUrl } from '../url';
import fetchData from '../utils/fetchData';
import sendRequest from '../utils/sendRequest';

export const MessageContext = createContext({
    messages: [],
    isLoading: true,
    error: null,
    sendMessage: () => { },
    refreshMessages: () => { },
});

const MessageProvider = ({ children }) => {
    const queryClient = useQueryClient();

    const { data: messages, isLoading, error, refetch } = useQuery(
        ['messages'],
        () => fetchData(`${serverUrl}/msg/receive`),
        {
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        }
    );

    const sendMessageMutation = useMutation(
        (newMessage) => sendRequest('POST', newMessage, `${serverUrl}/msg/send`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['messages']);
            },
        }
    );

    const sendMessage = async (newMessage) => {
        try {
            await sendMessageMutation.mutateAsync(newMessage);
        } catch (error) {
            console.log('Błąd podczas wysyłania wiadomości.', error);
        }
    };

    const refreshMessages = () => {
        refetch();
    };

    return (
        <messageContext.Provider value={{ messages: messages || [], isLoading, error, sendMessage, refreshMessages }}>
            {children}
        </messageContext.Provider>
    );
};

export default MessageProvider;