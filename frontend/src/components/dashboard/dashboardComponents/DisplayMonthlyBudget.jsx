import { useContext, useState, useEffect } from "react"
import { useSocket } from "../../../store/socketContext";
import { DataContext } from '../../../store/dataContext';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

export default function MonthlyBudget() {
    const { data, isLoading, error } = useContext(DataContext);
    const { connected, messages, error: socketError } = useSocket();
    const [currentInitBudget, setCurrentInitBudget] = useState('000');
    const [currentBudgetPeriod, setCurrentBudgetPeriod] = useState('00-00');
    const { t } = useTranslation("dashboardComponents");

    useEffect(() => {
        if (!isLoading && !error && data?.houseData?.length > 0) {
            const houseData = data.houseData[0];
            const lastInitBudget = houseData?.lastInitialBudget;
            const startPeriod = houseData?.initialDefinedAt;
            const endPeriod = houseData?.initialValidUntil;
            setCurrentInitBudget(() => lastInitBudget);
            setCurrentBudgetPeriod(() => `${startPeriod} - ${endPeriod}`);
        };
    }, [data, isLoading, error]);

    useEffect(() => {
        if (!socketError && connected && messages?.initBudgets?.length > 0) {

            const latestBudget = messages.initBudgets[0];
            setCurrentInitBudget(() => latestBudget?.initBudget);
            setCurrentBudgetPeriod(() => latestBudget?.budgetPeriod);
        }
    }, [socketError, connected, messages]);

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