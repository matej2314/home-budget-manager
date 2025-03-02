import { useLocation } from "react-router-dom"

export default function MessagesFilterBtns({ messagesStates, handleChangeFilter }) {
    const location = useLocation();

    return (
        <div className="flex gap-3 mb-6">
            {messagesStates.map((type) => (
                <button
                    key={type}
                    onClick={() => handleChangeFilter(type)}
                    className={`border-2 border-slate-300 text-slate-700 bg-slate-300/40 py-1 px-2 rounded-xl hover:bg-inherit
                             hover:text-slate-800 shadow-lg hover:shadow-sm ${location.pathname === `/dashboard/messages/${type}` ? 'bg-slate-400/45' : null}`}
                    style={{ boxShadow: 'inset 0 0 2px 2px rgba(0, 0, 0, 0.15)' }}
                >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
            ))}
        </div>
    )
}