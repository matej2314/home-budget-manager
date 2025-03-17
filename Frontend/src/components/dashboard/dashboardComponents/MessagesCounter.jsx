import { useEffect, useState } from "react"
import { Link } from 'react-router-dom';
import { useSocket } from '../../../store/socketContext';
import { Icon } from '@iconify/react';
import { filterArray } from '../../../utils/arraysUtils/arraysFunctions';
import { useTranslation } from 'react-i18next';

export default function MessagesCounter() {
    const { connected, messages, error } = useSocket();
    const [userMessages, setUserMessages] = useState([]);
    const { t } = useTranslation("dashboardComponents");

    useEffect(() => {
        if (connected && !error && messages.length > 0) {
            const userMessages = filterArray(messages, (message) => message.type === 'newMessage');

            if (userMessages) {
                setUserMessages(userMessages);
            }
        }
    }, [messages, connected]);

    return (
        <Link to='messages/new'
            id='newMessages'
            className={`relative lg:w-1/4 h-[8.5rem] bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600/95 flex flex-row text-white justify-center items-start rounded-md gap-3 pt-5 ${userMessages.length == 0 ? 'pointer-events-none' : ''}`}
            style={{ boxShadow: 'inset 0 0 6px 6px rgba(0, 0, 0, 0.15)' }}
        >
            <div className="w-full flex flex-col items-center justify-start -translate-y-1 translate-x-1 gap-5">
                <h2 className="text-xl">{t("messagesCounter.heading")}</h2>
                <span className="text-xl">{userMessages.length > 0 ? userMessages.length : 0}</span>
            </div>
            <div className="absolute bottom-2 right-2 z-10">
                <Icon icon='tabler:message-2-down' width={100} style={{ opacity: 0.15, position: 'relative', top: '0.5rem', left: '0.5rem' }} />
            </div>
        </Link>
    );
}
