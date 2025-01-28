import DashboardHeader from '../../components/dashboard/dashboardComponents/DashBoardHeader';
import MatesList from '../../components/dashboard/dashboard-internal-components/MatesList';

export default function HouseMatesPage() {

    return (
        <div id="pagecontent" className="bg-slate-200 w-full h-screen">
            <DashboardHeader />
            <div id="middle-content" className="flex gap-5 border-2 border-b-slate-800/5 py-4 px-5">
                <MatesList mode='subpage' />
            </div>
        </div>
    )
}