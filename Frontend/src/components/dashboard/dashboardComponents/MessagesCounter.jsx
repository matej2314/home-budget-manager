import { useEffect, useState } from "react"
import { Link } from 'react-router-dom';
import { useSocket } from '../../../store/socketContext';
import { filterArray } from '../../../utils/arraysUtils/arraysFunctions'

export default function MessagesCounter() {

    const { connected, messages, error } = useSocket();
    const [userMessages, setUserMessages] = useState([]);

    useEffect(() => {
        if (connected && !error && messages.length > 0) {
            const userMessages = filterArray(messages, (message) => message.type === 'newMessage');

            if (userMessages) {
                setUserMessages(userMessages);
            };
        }
    }, [messages, connected]);

    return (
        <Link to='messages/new'
            id='newMessages'
            className={`md:w-1/4 h-[8.5rem] bg-sky-700/85 flex flex-row text-white justify-center items-start rounded-md gap-3 pt-5 ${userMessages.length == 0 ? 'pointer-events-none' : null}`}
        >
            <div className="w-full flex flex-col items-center justify-start -translate-y-1 translate-x-1 gap-5">
                <h2 className="text-xl">New messages:</h2>
                <span className="text-xl">{userMessages.length > 0 ? userMessages.length : 0}</span>
            </div>
        </Link>
    )
}