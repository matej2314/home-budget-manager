import DashboardHeader from '../../components/dashboard/dashboardComponents/DashBoardHeader';

export default function UserProfilePage() {


    return (
        <div id="pagecontent" className="bg-slate-200 w-full h-screen">
            <DashboardHeader />
            <div id="middle-content" className="flex gap-5 border-2 border-b-slate-800/5 py-4 px-5">
                <p>profile page</p>
            </div>
        </div>
    )
}