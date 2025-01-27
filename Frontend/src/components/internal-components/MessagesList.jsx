import { useContext } from "react";
import { DataContext } from '../../store/dataContext';

export default function MessagesList() {
    const { data, isLoading, error } = useContext(DataContext);

    const messages = !isLoading && !error && data.dashboardData.messagesData || [];

    return (
        <ul className="w-full h-fit flex flex-col items-center">
            {!isLoading && !error && messages ? (
                messages.map((message) => (
                    <li className="w-full h-fit flex justify-center gap-2">
                        <span>{message.sender}</span>
                        <span>{message.recipient}</span>
                        <span className="text-green-500">{message.message}</span>
                        <span>{message.date.split('T')[0]}</span>
                        <span>{message.is_read === 1 ? 'readed' : 'unreaded'}</span>
                    </li>
                ))
            ) : (
                <p>brak wiadomości</p>
            )}
        </ul>
    )
};