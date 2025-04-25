import { useContext, useEffect, useState } from "react";
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
        contextError: dataError
    } = useContext(DataContext);

    const [currentBalance, setCurrentBalance] = useState<number>();

    useEffect(() => {
        if (!dataLoading && data && !dataError && data?.houseData?.length) {
            setCurrentBalance(Number(data.houseData[0].liveBalance))
        }
    }, [dataLoading, data, dataError]);

    useEffect(() => {
        if (connected && messages && messages?.balanceUpdates?.length > 0) {
            const { newBalance } = messages.balanceUpdates[0].data;
            if (newBalance) {
                setCurrentBalance(Number(newBalance));
            }
        }
    }, [messages, connected]);

    return (
        <div id="liveBalance"
            className="lg:w-1/4 h-[8.5rem] bg-gradient-to-br from-sky-400 via-blue-400 to-sky-600/95 text-xl text-white flex flex-col justify-start items-center rounded-md pt-4 relative"
            style={{ boxShadow: 'inset 0 0 6px 6px rgba(0, 0, 0, 0.15)' }}
        >
            <div className="h-11/12 w-11/12 flex flex-col justify-center items-center gap-4">
                <h2 className="text-xl">{t("displayLiveBalance.heading")}</h2>
                <span
                    className={currentBalance && currentBalance > 0 ? 'text-xl text-lime-900/75' : "text-xl text-red-500"}
                >
                    {currentBalance !== null ? `${currentBalance} zł` : t("displayLiveBalance.noData")}
                </span>
            </div>
            <div className="absolute bottom-2 right-2">
                <Icon
                    icon='vaadin:scale-unbalance'
                    width={95}
                    style={{ opacity: 0.11, position: 'relative', top: '0.4rem', left: '0.6rem' }}
                />
            </div>
        </div>
    );
}
