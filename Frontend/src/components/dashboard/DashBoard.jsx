import DashboardHeader from './dashboardComponents/DashBoardHeader';
import MatesCounter from './dashboardComponents/MatesCounter';
import MonthlyBudget from './dashboardComponents/DisplayMonthlyBudget';
import DisplayLiveBalance from './dashboardComponents/DisplayLiveBalance';
import MessagesCounter from './dashboardComponents/MessagesCounter';
import DisplayMatesList from './dashboardComponents/DisplayMatesList';
import LastTransactionsList from './dashboardComponents/LastTransactionsList';
import TopCategoriesList from './dashboardComponents/TopCategoriesList';
import FastActions from './dashboard-internal-components/FastActionsSection';
import BarChart from '../charts/BarChart';

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
            <div id='chartsPart' className="h-[30rem] mb-4 mx-5 flex flex-row gap-3">
                <div id="transactions-to-months-chart" className="w-full sm:w-1/2 lg:w-full flex flex-col items-center border-2 border-slate-400 pt-3 ml-5 mr-5 flex-grow flex-shrink">
                    <h2 className="text-center text-xl mb-3">Transactions over time</h2>
                    {/* <BarChart
                        labels={actionCountLabels}
                        dataValues={transactionCounts}
                        title='Transaction counts'
                        secondTitle="Transactions in time"
                        colors={["rgba(54, 162, 235, 0.5)"]}
                        borderColors={["rgba(54, 162, 235, 1)"]}
                        secondColors={["rgba(255, 99, 132, 0.5)"]}
                        secondBorderColors={["rgba(255, 99, 132, 1)"]}
                        width={400}
                        height={400}
                    /> */}
                </div>
            </div>
        </div>
    )
};