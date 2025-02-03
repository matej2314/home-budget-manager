import { useContext } from "react"
import { AuthContext } from "../../store/authContext"
import DashboardHeader from "../../components/dashboard/dashboardComponents/DashBoardHeader"

export default function StatsPage() {
    const { user } = useContext(AuthContext);

    return (
        <div id="pagecontent" className="bg-slate-200 min-w-screen min-h-screen">
            <DashboardHeader />
            <div id="middle-content" className="flex gap-5 border-2 border-b-slate-800/5 py-4 px-5">
                <p>middle content</p>
            </div>
        </div>
    )
}