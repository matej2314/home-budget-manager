import { useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next";

export default function MessagesFilterBtns({ messagesStates, handleChangeFilter }) {
    const location = useLocation();
    const { t } = useTranslation("utils");

    return (
        <div className="flex gap-3 mb-6">
            {messagesStates.map((type) => (
                <button
                    key={type}
                    onClick={() => handleChangeFilter(type)}
                    className={`msgs-filter-btn ${location.pathname === `/dashboard/messages/${type}` ? 'bg-slate-400/45' : null}`}
                    style={{ boxShadow: 'inset 0 0 2px 2px rgba(0, 0, 0, 0.15)' }}
                >
                    {t(`messagesStates.${type}`)}
                </button>
            ))}
        </div>
    )
}