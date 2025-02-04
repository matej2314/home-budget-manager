import DashboardHeader from './dashboardComponents/DashBoardHeader';
import MatesCounter from './dashboardComponents/MatesCounter';
import MonthlyBudget from './dashboardComponents/DisplayMonthlyBudget';
import DisplayLiveBalance from './dashboardComponents/DisplayLiveBalance';
import MessagesCounter from './dashboardComponents/MessagesCounter';
import DisplayMatesList from './dashboardComponents/DisplayMatesList';
import LastTransactionsList from './dashboardComponents/LastTransactionsList';
import TopCategoriesList from './dashboardComponents/TopCategoriesList';
import BudgetPerDay from './dashboardComponents/charts-dashboard-components/BudgetPerDay';
import TransactionsPerDay from './dashboardComponents/charts-dashboard-components/TransactionsPerDay';
import FastActions from './dashboard-internal-components/FastActionsSection';

export default function DashBoard() {

    return (
        <div id="pagecontent" className="w-full flex flex-col justify-center bg-slate-200 pr-[10rem]">
            <DashboardHeader />
            <div id="house-info-blocks" className="flex gap-5 border-2 border-b-slate-800/5 py-4 pl-5 pr-9">
                <MatesCounter />
                <MonthlyBudget />
                <DisplayLiveBalance />
                <MessagesCounter />
            </div>
            <FastActions />
            <div id="middlePart" className=" h-fit flex gap-3 pr-8">
                <DisplayMatesList />
                <LastTransactionsList />
                <TopCategoriesList main={true} />
            </div>
            <div id='chartsPart' className="h-[30rem] mb-4 mx-5 flex flex-col gap-3">
                <BudgetPerDay />
                <TransactionsPerDay />
            </div>
        </div>
    )
};