import { useContext, useEffect, useState } from "react"
import { Link } from 'react-router-dom';
import { useSocket } from '../../../store/socketContext';

export default function MessagesCounter() {

    const { connected, messages, error } = useSocket();
    const [userMessages, setUserMessages] = useState([]);

    useEffect(() => {
        if (connected && !error && messages.length > 0) {
            const userMessages = messages.filter((message) => message.type === 'newMessage');

            if (userMessages) {
                setUserMessages(userMessages);
            };
        }
    }, [messages, connected]);

    return (
        <div
            id='newMessages'
            className="w-1/4 h-[8.5rem] bg-sky-700/85 flex flex-col text-white justify-start items-center rounded-md pt-4">
            <Link to='messages' className="h-11/12 w-11/12 flex flex-col justify-center items-center gap-4">
                <h2 className="text-xl">New messages:</h2>
                <span className="text-xl">{userMessages.length > 0 ? userMessages.length : 0}</span>
            </Link>
        </div>
    )
}