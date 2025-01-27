import DashboardHeader from "../../components/dashboard/dashboardComponents/DashBoardHeader"


export default function HouseInfoPage() {

    return (
        <div id="pagecontent" className="bg-slate-200 w-full h-screen">
            <DashboardHeader />
            <div id="middle-content" className="flex gap-5 border-2 border-b-slate-800/5 py-4 px-5">
                <p>middle content</p>
            </div>
        </div>
    )
}