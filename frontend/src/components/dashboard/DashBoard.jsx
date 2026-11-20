import { useContext } from 'react';
import { DataContext } from '../../store/dataContext';
import { useTransactionsStore } from '../../store/transactionsStore';
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

    const { data } = useContext(DataContext);
    const { actionsData } = useTransactionsStore();

    return (
        <>
            {actionsData && data && <div id="pagecontent" className="min-h-full min-w-0 bg-page overflow-y-auto no-scrollbar pb-8">
                <DashboardHeader />
                <div className="px-3 sm:px-5 lg:px-8 pt-4 sm:pt-5 space-y-4 sm:space-y-5">
                    <div id="house-info-blocks" className="grid grid-cols-1 indirect:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                        <MatesCounter />
                        <MonthlyBudget />
                        <DisplayLiveBalance />
                        <MessagesCounter />
                    </div>
                    <div className='surface-card px-2 sm:px-3 py-2'>
                        <FastActions profilePage={false} />
                    </div>
                    <div id='chartsPart' className="w-full min-w-0">
                        <LossOrGainChart />
                    </div>
                    <div id="middlePart" className="w-full min-w-0 flex flex-col gap-4 sm:gap-5">
                        <DisplayMatesList />
                        <LastTransactionsList limit={5} />
                        <TopCategoriesList main={true} />
                    </div>
                </div>
            </div>}
        </>

    )
};
