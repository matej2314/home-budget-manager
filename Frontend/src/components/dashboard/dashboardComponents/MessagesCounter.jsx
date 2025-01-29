import { useContext } from "react"
import { DataContext } from "../../../store/dataContext";
import { AuthContext } from "../../../store/authContext";

export default function MessagesCounter() {
    const { data, isLoading, error } = useContext(DataContext);
    const { user } = useContext(AuthContext);

    const messages = !isLoading && !error && data.dashboardData.messagesData || [];

    const newMessages = messages.filter((message) => message.recipient === user.userName)
        .filter((message) => message.readed == 0)

    return (
        <div id='newMessages' className="w-1/4 h-[8.5rem] bg-sky-700/85 flex flex-col text-white justify-start items-center rounded-md pt-4">
            <div className="h-11/12 w-11/12 flex flex-col justify-center items-center gap-4">
                <h2 className="text-xl">New messages:</h2>
                <span className="text-xl">{newMessages.length}</span>
            </div>
        </div>
    )
}