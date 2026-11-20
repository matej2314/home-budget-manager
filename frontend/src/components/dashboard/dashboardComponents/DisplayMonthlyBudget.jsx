import { useContext } from "react"
import { useSocket } from "../../../store/socketContext";
import { DataContext } from '../../../store/dataContext';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

export default function MonthlyBudget() {
    const { data, isLoading, dataError: error } = useContext(DataContext);
    const { connected, messages, error: socketError } = useSocket();
    const { t } = useTranslation("dashboardComponents");

    const houseData = (!isLoading && !error && data?.houseData?.length > 0) ? data.houseData[0] : null;
    const boardBudget = houseData?.lastInitialBudget;
    const boardPeriod = houseData
        ? `${houseData.initialDefinedAt} - ${houseData.initialValidUntil}`
        : null;

    const latestBudget = (!socketError && connected && messages?.initBudgets?.length > 0)
        ? messages.initBudgets[0]
        : null;

    const currentInitBudget = latestBudget?.initBudget ?? boardBudget ?? '000';
    const currentBudgetPeriod = latestBudget?.budgetPeriod ?? boardPeriod ?? '00-00';

    return (
        <div id="monthlyBudget" className="metric-card">
            <div className="flex items-start justify-between gap-3">
                <h2 className="text-sm font-medium text-muted">{t("declaredBudget.heading")}</h2>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Icon icon='emojione-monotone:money-bag' width={22} height={22} />
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink break-all">
                    {currentInitBudget} zł
                </span>
                <span className="text-xs text-muted">{currentBudgetPeriod}</span>
            </div>
        </div>
    )
}
