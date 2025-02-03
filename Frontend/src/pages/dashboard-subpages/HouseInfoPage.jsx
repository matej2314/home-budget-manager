import { useContext, useState } from "react"
import { DataContext } from "../../store/dataContext"
import DashboardHeader from "../../components/dashboard/dashboardComponents/DashBoardHeader"
import MatesList from '../../components/dashboard/dashboard-internal-components/MatesList';

export default function HouseInfoPage() {
    const { data, isLoading, error: contextError, refreshData } = useContext(DataContext);
    const [houseInfoData, setHouseInfoData] = useState();

    const basicHouseInfo = !isLoading && !contextError && data.houseData[0] || [];
    const houseMates = !isLoading && !contextError && data.houseMates[0] || [];
    const transactionsData = !isLoading && !contextError && data.actionsData[0] || [];
    const statsData = !isLoading && !contextError && data.statsData || [];

    return (
        <div id="pagecontent" className="w-full h-screen bg-slate-200">
            <DashboardHeader />
            <div id="middle-content" className="w-full gap-5 border-2 border-b-slate-800/5 py-4 px-5">
                <div id="overall-house-info" className="w-full h-fit flex flex-col gap-3 items-center">
                    <div className="w-7/12 h-fit flex justify-center items-center border-2 border-slate-400 rounded-xl">
                        <p className="w-full h-fit flex justify-center items-center px-3 py-3 gap-4">
                            <span><span className="font-bold">House name:</span> {basicHouseInfo.houseName}</span>
                            <span className="text-md">&#124;</span>
                            <span><span className="font-bold">Host name:</span> {basicHouseInfo.host}</span>
                            <span className="text-md">&#124;</span>
                            <span><span className="font-bold">Last balance:</span> {basicHouseInfo.lastBalanceDate}</span>
                        </p>
                    </div>
                    <MatesList mode='subpage' />
                </div>
            </div>
        </div>
    )
}