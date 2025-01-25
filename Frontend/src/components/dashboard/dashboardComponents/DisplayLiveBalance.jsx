import { useContext } from "react";
import { MessageContext } from "../../../store/messageContext";



export default function DisplayLiveBalance() {
    const { messages, isLoading, error } = useContext(MessageContext);

    return (
        <div id="liveBalance" className="w-1/4 h-[8.5rem] bg-sky-500/85 text-xl text-white flex flex-col justify-start items-center rounded-md pt-4">
            <div className="h-11/12 w-11/12 flex flex-col justify-center items-center gap-4">
                <h2 className="text-xl">Current budget:</h2>
                <span className="text-xl text-lime-900/75">800 zł</span>
                <span className="text-xl text-red-500">-500 zł</span>
            </div>
        </div>
    )
}