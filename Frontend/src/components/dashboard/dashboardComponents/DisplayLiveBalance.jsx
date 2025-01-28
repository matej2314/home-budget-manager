import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../store/dataContext";
import { MessageContext } from "../../../store/messageContext";

export default function DisplayLiveBalance() {
    const {
        messages,
        isLoading: socketLoading,
        error: socketError
    } = useContext(MessageContext);

    const {
        data,
        isLoading: dataLoading,
        error: dataError
    } = useContext(DataContext);

    const [currentBalance, setCurrentBalance] = useState(null);

    useEffect(() => {
        if (!dataLoading && data && !dataError && data.dashboardData?.houseData?.length) {
            setCurrentBalance(data.dashboardData.houseData[0].liveBalance)
        }
    }, [dataLoading, data, dataError]);

    useEffect(() => {
        if (!socketError && messages && messages.length > 0) {
            console.log('otrzymane wiadomości:', messages)
            const balanceMessage = messages
                .filter((message) => message.type === 'balance_update')
                .pop();
            if (balanceMessage) {
                setCurrentBalance(balanceMessage.data.newBalance);
                console.log(balanceMessage.data.newBalance)
            };
        }

    }, [messages, socketError]);

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