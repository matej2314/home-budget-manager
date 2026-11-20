import { useContext } from "react";
import { DataContext } from "../../../store/dataContext";
import { useSocket } from "../../../store/socketContext";
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

export default function DisplayLiveBalance() {
    const { messages, connected } = useSocket();
    const { t } = useTranslation("dashboardComponents");

    const {
        data,
        isLoading: dataLoading,
        dataError,
    } = useContext(DataContext);

    const boardBalance = (!dataLoading && data && !dataError && data?.houseData?.length)
        ? data.houseData[0].liveBalance
        : null;
    const socketBalance = (connected && messages?.balanceUpdates?.length > 0)
        ? messages.balanceUpdates[0].newBalance
        : null;
    const currentBalance = socketBalance || boardBalance;
    const isPositive = currentBalance !== null && Number(currentBalance) > 0;

    return (
        <div id="liveBalance" className="metric-card">
            <div className="flex items-start justify-between gap-3">
                <h2 className="text-sm font-medium text-muted">{t("displayLiveBalance.heading")}</h2>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-sky-500/10 text-sky-600">
                    <Icon icon='vaadin:scale-unbalance' width={22} height={22} />
                </span>
            </div>
            <span
                className={`text-2xl sm:text-3xl font-semibold tracking-tight break-all ${currentBalance === null
                    ? 'text-muted'
                    : isPositive
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                    }`}
            >
                {currentBalance !== null ? `${currentBalance} zł` : t("displayLiveBalance.noData")}
            </span>
        </div>
    );
}
