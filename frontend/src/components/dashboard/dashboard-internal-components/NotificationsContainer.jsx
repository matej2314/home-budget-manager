import { useContext, useState } from 'react'
import { DataContext } from '../../../store/dataContext';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion'
import { iconsMap } from '../../../utils/notificationsIconsMap';
import useNotificationsStore from '../../../store/notificationsStore';
import { checkNotifications } from '../../../utils/notificationsUtils';

export default function NotificationsContainer({ notifications, clickAction }) {
    const { data, isLoading, dataError: error } = useContext(DataContext);
    const { clearAllNotifications, loading } = useNotificationsStore();
    const [clearing, setClearing] = useState(false);
    const { t: tInternal } = useTranslation("dashboardInternal");
    const { t: tCommon } = useTranslation("common")

    const houseName = (!isLoading && !error && data?.houseData?.[0]?.houseName) || '';
    const hasItems = checkNotifications(notifications || {});

    const handleClearAll = async () => {
        if (!hasItems || clearing || loading) return;
        try {
            setClearing(true);
            await clearAllNotifications();
        } finally {
            setClearing(false);
        }
    };

    return (
        <motion.div
            className="absolute top-12 left-0 sm:left-auto z-30 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-surface shadow-[0_8px_24px_rgba(28,40,72,0.12)] overflow-hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
        >
            <div className="flex items-center justify-between gap-3 px-3 py-2.5 border-b border-slate-100 bg-page/80">
                <p className="text-sm font-semibold text-ink">
                    {tInternal("headerIcons.noticeTitle")}
                </p>
                <button
                    type="button"
                    onClick={handleClearAll}
                    disabled={!hasItems || clearing || loading}
                    className="text-xs font-medium text-accent hover:text-accent/80 disabled:text-muted disabled:opacity-50 transition-colors"
                >
                    {tInternal("notificationsContainer.clearAll")}
                </button>
            </div>

            <div className="max-h-72 overflow-y-auto no-scrollbar p-2">
                {hasItems ? (
                    <ul className="w-full flex flex-col gap-1">
                        {Object.entries(notifications).map(([category, items]) =>
                            items.map((notification, index) => (
                                <li
                                    key={`${category}-${notification.id ?? index}`}
                                    className="w-full flex items-start gap-2 rounded-lg px-2 py-2 hover:bg-page transition-colors"
                                >
                                    <Icon icon={iconsMap[category]} width={22} height={22} className="shrink-0 mt-0.5 text-muted" />
                                    <p className="flex-1 min-w-0 text-sm text-ink leading-snug">
                                        {houseName ? (
                                            <span className="font-semibold mr-1">{houseName}:</span>
                                        ) : null}
                                        <span className="text-muted">{tCommon(notification.message)}</span>
                                    </p>
                                    <button
                                        type="button"
                                        className="shrink-0 p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                                        aria-label="Mark as read"
                                        onClick={() => clickAction(category, notification.id)}
                                    >
                                        <Icon icon="teenyicons:tick-circle-outline" width={18} height={18} />
                                    </button>
                                </li>
                            )),
                        )}
                    </ul>
                ) : (
                    <p className="px-2 py-4 text-sm text-muted text-center">
                        {tInternal("notificationsContainer.noNoticesError")}
                    </p>
                )}
            </div>

        </motion.div>
    )
}
