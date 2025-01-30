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
import TransactionsCategories from './dashboardComponents/charts-dashboard-components/TransactionsCategories';
import FastActions from './dashboard-internal-components/FastActionsSection';

export default function DashBoard() {

    return (
        <div id="pagecontent" className="bg-slate-200 w-full h-full">
            <DashboardHeader />
            <div id="house-info-blocks" className="flex gap-5 border-2 border-b-slate-800/5 py-4 px-5">
                <MatesCounter />
                <MonthlyBudget />
                <DisplayLiveBalance />
                <MessagesCounter />
            </div>
            <FastActions />
            <div id="middlePart" className="w-full h-fit flex gap-3">
                <DisplayMatesList />
                <LastTransactionsList />
                <TopCategoriesList />
            </div>
            <div id='chartsPart' className=" h-[30rem] mb-4 mx-5 flex flex-col gap-3">
                <BudgetPerDay />
                <TransactionsPerDay />
                <TransactionsCategories />
            </div>
        </div>
    )
};