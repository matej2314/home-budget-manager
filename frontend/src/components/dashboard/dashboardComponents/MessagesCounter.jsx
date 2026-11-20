import { Link } from 'react-router-dom';
import { useSocket } from '../../../store/socketContext';
import { Icon } from '@iconify/react';
import { filterArray } from '../../../utils/arraysUtils/arraysFunctions';
import { useTranslation } from 'react-i18next';

export default function MessagesCounter() {
    const { connected, messages, error } = useSocket();
    const { t } = useTranslation("dashboardComponents");

    const userMessages = (connected && !error && messages.length > 0)
        ? filterArray(messages, (message) => message.type === 'newMessage')
        : [];

    return (
        <Link
            to='messages/new'
            id='newMessages'
            className={`metric-card ${userMessages.length == 0 ? 'pointer-events-none' : 'hover:border-accent/30'}`}
        >
            <div className="flex items-start justify-between gap-3">
                <h2 className="text-sm font-medium text-muted">{t("messagesCounter.heading")}</h2>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent-soft text-accent">
                    <Icon icon='tabler:message-2-down' width={22} height={22} />
                </span>
            </div>
            <span className="text-3xl font-semibold tracking-tight text-ink">
                {userMessages.length > 0 ? userMessages.length : 0}
            </span>
        </Link>
    );
}
