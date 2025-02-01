import DashboardHeader from "../../components/dashboard/dashboardComponents/DashBoardHeader"


export default function HouseInfoPage() {

    return (
        <div id="pagecontent" className="w-full min-h-screen bg-slate-200">
            <DashboardHeader />
            <div id="middle-content" className="flex gap-5 border-2 border-b-slate-800/5 py-4 px-5">
                <p>my house page</p>
            </div>
        </div>
    )
}