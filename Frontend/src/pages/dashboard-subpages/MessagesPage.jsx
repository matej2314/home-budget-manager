import DashboardHeader from "../../components/dashboard/dashboardComponents/DashBoardHeader"
import MessagesList from '../../components/internal-components/MessagesList';

export default function MessagesPage() {

    return (
        <div id="pagecontent" className="bg-slate-200 w-full h-screen">
            <DashboardHeader />
            <div id="middle-content" className="flex gap-5 border-2 border-b-slate-800/5 py-4 px-5">
                <MessagesList />
            </div>
        </div>
    )
}