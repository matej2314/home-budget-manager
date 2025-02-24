import { useContext } from 'react';
import { AuthContext } from '../../store/authContext';
import DashboardHeader from './dashboardComponents/DashBoardHeader';
import MatesCounter from './dashboardComponents/MatesCounter';
import MonthlyBudget from './dashboardComponents/DisplayMonthlyBudget';
import DisplayLiveBalance from './dashboardComponents/DisplayLiveBalance';
import MessagesCounter from './dashboardComponents/MessagesCounter';
import DisplayMatesList from './dashboardComponents/DisplayMatesList';
import LastTransactionsList from './dashboardComponents/LastTransactionsList';
import TopCategoriesList from './dashboardComponents/TopCategoriesList';
import FastActions from './dashboard-internal-components/FastActionsSection';
import LossOrGainChart from './dashboardComponents/charts-dashboard-components/LossOrGainChart';


export default function DashBoard() {

    const { user } = useContext(AuthContext);

    return (

        <div id="pagecontent" className="w-full h-full min-w-screen bg-slate-200 overflow-y-auto no-scrollbar pb-4">
            <DashboardHeader />
            <div id="house-info-blocks" className="grid grid-cols-2 lg:flex lg:flex-row gap-5 border-2 border-b-slate-800/5 py-4 pl-5 pr-9">
                <MatesCounter />
                <MonthlyBudget />
                <DisplayLiveBalance />
                <MessagesCounter />
            </div>
            <div className='mt-1'>
                <FastActions />
            </div>
            <div id='chartsPart' className="max-w-screen h-fit mb-4 mx-5 flex flex-col gap-3">
                <LossOrGainChart />
            </div>
            <div id="middlePart" className="max-w-screen pl-5 w-full flex flex-col items-center h-fit gap-3 pr-8">
                <DisplayMatesList />
                <LastTransactionsList limit={5} />
                <TopCategoriesList main={true} />
            </div>
        </div>
    )
};