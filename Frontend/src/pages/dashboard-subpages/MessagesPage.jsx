import DashboardHeader from "../../components/dashboard/dashboardComponents/DashBoardHeader"
import MessagesList from '../../components/dashboard-internal-components/MessagesList';

export default function MessagesPage() {

    return (
        <div id="pagecontent" className="bg-slate-200 w-full h-screen">
            <DashboardHeader />
            <div id="middle-content" className="flex flex-col gap-5 border-2 border-b-slate-800/5 py-4 px-5">
                <h2 className="w-full h-fit flex justify-center text-2xl">Your messages:</h2>
                <MessagesList />
            </div>
        </div>
    )
}