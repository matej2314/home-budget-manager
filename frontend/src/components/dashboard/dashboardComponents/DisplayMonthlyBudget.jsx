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
        <div id="monthlyBudget"
            className="lg:w-1/4 h-[8.5rem] bg-gradient-to-br backdrop-blur-xl from-green-500/50 via-green-500/90 to-green-600/75 lg:text-xl text-white flex flex-col justify-start items-center rounded-md pt-4"
            style={{ boxShadow: 'inset 0 0 6px 6px rgba(0, 0, 0, 0.15)' }}
        >
            <div className="absolute bottom-0 right-0 flex justify-center items-center">
                <Icon icon='emojione-monotone:money-bag' width={100} style={{ opacity: 0.2, position: 'relative', top: '0.5rem', left: '0.3rem' }} />
            </div>
            <div className="h-11/12 w-11/12 flex flex-col justify-center items-center gap-2 lg:gap-4">
                <h2 className="lg:text-xl">{t("declaredBudget.heading")}</h2>
                <span className="lg:text-xl text-white">{currentInitBudget} zł</span>
                <span className=" text-xs md:text-sm">{currentBudgetPeriod}</span>
            </div>
        </div>
    )
}
