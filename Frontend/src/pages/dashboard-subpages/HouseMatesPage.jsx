import useDocumentTitle from '../../hooks/useDocumentTitle';
import DashboardHeader from '../../components/dashboard/dashboardComponents/DashBoardHeader';
import MatesList from '../../components/dashboard/dashboard-internal-components/MatesList';


export default function HouseMatesPage() {
    useDocumentTitle('Housemates');

    return (
        <div id="pagecontent" className="bg-slate-200 w-full min-h-screen">
            <DashboardHeader />
            <div id="middle-content" className="w-full flex flex-col justify-center items-center gap-5 py-4 mx-auto">
                <h2 className="min-w-full h-fit flex justify-center text-2xl">Your housemates:</h2>
                <MatesList mode='subpage' />
            </div>
        </div>
    )
}