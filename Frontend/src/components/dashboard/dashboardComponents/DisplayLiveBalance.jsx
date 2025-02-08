import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../store/dataContext";
import { useSocket } from "../../../store/socketContext";

export default function DisplayLiveBalance() {
    const { messages, connected } = useSocket();

    const {
        data,
        isLoading: dataLoading,
        error: dataError
    } = useContext(DataContext);

    const [currentBalance, setCurrentBalance] = useState(null);

    useEffect(() => {
        if (!dataLoading && data && !dataError && data.houseData?.length) {
            setCurrentBalance(data.houseData[0].liveBalance)
        }
    }, [dataLoading, data, dataError]);

    useEffect(() => {
        if (connected && messages && messages.balanceUpdates.length > 0) {
            const { newBalance } = messages.balanceUpdates[0];
            if (newBalance) {
                setCurrentBalance(newBalance);

            };
        }

    }, [messages, connected]);

    console.log(`balance w display: ${JSON.stringify(messages)}`)

    return (
        <div id="liveBalance" className="w-1/4 h-[8.5rem] bg-sky-500/85 text-xl text-white flex flex-col justify-start items-center rounded-md pt-4">
            <div className="h-11/12 w-11/12 flex flex-col justify-center items-center gap-4">
                <h2 className="text-xl">Current budget:</h2>
                <span
                    className={currentBalance && currentBalance > 0 ? 'text-xl text-lime-900/75' : "text-xl text-red-500"}
                >
                    {currentBalance !== null ? `${currentBalance} zł` : 'Brak danych'}
                </span>
            </div >
        </div>
    )
}