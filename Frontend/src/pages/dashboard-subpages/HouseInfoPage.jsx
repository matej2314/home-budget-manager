import { useContext, useState, useMemo } from "react"
import { Link } from 'react-router-dom';
import { DataContext } from "../../store/dataContext"
import { parseISO, format } from "date-fns";
import DashboardHeader from "../../components/dashboard/dashboardComponents/DashBoardHeader"
import MatesList from '../../components/dashboard/dashboard-internal-components/MatesList';
import TransactionsList from '../../components/dashboard/dashboard-internal-components/TransactionsList';
import TopCategoriesList from '../../components/dashboard/dashboardComponents/TopCategoriesList';
import BarChart from "../../components/charts/BarChart";

export default function HouseInfoPage() {
    const { data, isLoading, error: contextError, refreshData } = useContext(DataContext);

    const basicHouseInfo = !isLoading && !contextError && data.houseData[0] || [];
    const houseMates = !isLoading && !contextError && data.houseMates || [];
    const transactionsData = !isLoading && !contextError && data.actionsData[0] || [];
    const statsData = !isLoading && !contextError && data.statsData || [];

    const { labels, monthlyBalances, definedBudgets } = useMemo(() => {
        if (!statsData.length) return { labels: [], monthlyBalances: [], definedBudgets: [] };

        return {
            labels: statsData.map(item => format(parseISO(item.monthlyBalanceDate), "yyyy-MM-dd")),
            monthlyBalances: statsData.map(item => item.monthlyBalanceValue),
            definedBudgets: statsData.map(item => item.definedMonthlyBudgets),
        };
    }, [statsData]);

    const { actionCountLabels, transactionCounts } = useMemo(() => {
        if (!statsData.length) return { actionCountLabels: [], transactionCounts: [] };

        return {
            actionCountLabels: statsData.map(
                item => `${item.countStartDate} - ${item.monthlyBalanceDate}`
            ),
            transactionCounts: statsData.map(item => item.transactionCount),
        };
    });

    return (
        <div id="pagecontent" className="h-full w-screen bg-slate-200 overflow-y-auto no-scrollbar">
            <DashboardHeader />
            <div id="middle-content" className="w-full h-full border-2 border-b-slate-800/5 px-7 flex flex-col flex-wrap items-center gap-5 mt-2">
                <div id="content-header" className="w-full flex flex-col items-start justify-start gap-2">
                    <div className="w-7/12 h-fit flex justify-center items-center border-2 border-slate-400 rounded-xl mx-auto">
                        <p className="w-full h-fit flex justify-center items-center px-3 py-3 gap-4">
                            <span><span className="font-bold">House name:</span> {basicHouseInfo.houseName}</span>
                            <span className="text-md">&#124;</span>
                            <span><span className="font-bold">Host username:</span> {basicHouseInfo.host}</span>
                            <span className="text-md">&#124;</span>
                            <span><span className="font-bold">Date of last balance:</span> {basicHouseInfo.lastBalanceDate}</span>
                        </p>
                    </div>
                    <div id="housemates-container" className="w-fit h-fit flex border-2 border-slate-400 rounded-xl mx-auto gap-2 p-3">
                        <p className="font-bold">Housemates:</p>
                        <p>{houseMates.length}</p>
                        <Link to='/dashboard/housemates' className="font-semibold text-slate-500 hover:text-slate-800">- View housemates list</Link>
                    </div>
                </div>
                <div id="content-transactions-section" className="min-w-screen h-full flex flex-col justify-start items-start gap-5 flex-wrap">
                    <div id="last-five-transactions" className="flex flex-col items-center gap-3 border-2 border-slate-400 px-4 rounded-md">
                        <h2 className="text-xl flex justify-center">Last 5 transactions:</h2>
                        <TransactionsList limit={5} mainSite={true} />
                    </div>
                    <div id="charts1" className="w-full h-fit flex flex-row justify-start items-start gap-3 mb-5">
                        <div id="transactions-to-months-chart" className="w-full  flex flex-col flex-wrap justify-start items-center border-2 border-slate-400 pt-3">
                            <h2 className="text-center text-xl mb-3">Transactions over time</h2>
                            <BarChart
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

                            />
                        </div>
                        <div id="initBudget-monthlyBudget-comparison" className="w-full h-fit flex flex-col flex-wrap justify-start items-center border-2 border-slate-400 pt-3 px-3">
                            <h2 className="text-center text-xl mb-3">Monthly Balance vs Defined Budgets</h2>
                            <BarChart
                                labels={labels}
                                dataValues={monthlyBalances}
                                secondDataValues={definedBudgets}
                                title="Monthly Balance"
                                secondTitle="Defined Budgets"
                                colors={["rgba(54, 162, 235, 0.5)"]}
                                borderColors={["rgba(54, 162, 235, 1)"]}
                                secondColors={["rgba(255, 99, 132, 0.5)"]}
                                secondBorderColors={["rgba(255, 99, 132, 1)"]}
                                width={400}
                                height={450}
                            />
                        </div>
                        <div id="top-transaction-categories+ chart" className="w-fit h-fit flex flex-col flex-wrap justify-start items-start px-3">
                            <TopCategoriesList main={false} />
                        </div>
                        <div id="top-transaction-categories+ chart" className="w-full h-fit flex flex-col flex-wrap justify-start items-center border-2 border-slate-400 pt-3">
                            <h2 className="text-center text-xl mb-3">Most active mates list</h2>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
