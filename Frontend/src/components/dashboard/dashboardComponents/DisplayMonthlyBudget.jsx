import { useContext, useState, useEffect } from "react"
import { useSocket } from "../../../store/socketContext";
import { DataContext } from '../../../store/dataContext';

export default function MonthlyBudget() {
    const { data, isLoading, error } = useContext(DataContext);
    const { connected, messages, error: socketError } = useSocket();
    const [currentInitBudget, setCurrentInitBudget] = useState('000');
    const [currentBudgetPeriod, setCurrentBudgetPeriod] = useState('00-00');

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
        <div id="monthlyBudget" className="w-1/4 h-[8.5rem] bg-green-600/80 text-xl text-white flex flex-col justify-start items-center rounded-md pt-4">
            <div className="h-11/12 w-11/12 flex flex-col justify-center items-center gap-4">
                <h2 className="text-xl">Declared monthly budget:</h2>
                <span className="text-xl text-white">{currentInitBudget} zł</span>
                <span className="text-sm">{currentBudgetPeriod}</span>
            </div>
        </div>
    )
}