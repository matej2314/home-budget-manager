import { useContext, useMemo } from "react";
import { Link } from 'react-router-dom';
import { DataContext } from "../../store/dataContext";
import DashboardHeader from "../../components/dashboard/dashboardComponents/DashBoardHeader";
import TransactionsList from '../../components/dashboard/dashboard-internal-components/TransactionsList';
import BudgetPerDay from "../../components/dashboard/dashboardComponents/charts-dashboard-components/BudgetPerDay";
import TransactionsPerDay from "../../components/dashboard/dashboardComponents/charts-dashboard-components/TransactionsPerDay";
import BalanceBudgetComparison from "../../components/dashboard/dashboardComponents/charts-dashboard-components/BalanceBudgetComparison";
import TransactionsOverTime from "../../components/dashboard/dashboardComponents/charts-dashboard-components/TransactionsOverTime";

export default function HouseInfoPage() {
    const { data, isLoading, error: contextError, refreshData } = useContext(DataContext);

    const { houseData, houseMates, statsData, dailyData } = data;

    const getData = (data, defaultValue) => (!isLoading && !contextError && data) || defaultValue;

    const basicHouseInfo = getData(houseData[0], []);
    const dailyInfo = getData(dailyData, []);
    const stats = getData(statsData, []);

    const { labels, monthlyBalances, definedBudgets, monthlyTransactionCounts, actionCountLabels } = useMemo(() => {
        if (!stats || !stats.length) {
            return { labels: [], monthlyBalances: [], definedBudgets: [], monthlyTransactionCounts: [], actionCountLabels: [] };
        }

        return {
            labels: stats.map(item => item.monthlyBalanceDate),
            monthlyBalances: stats.map(item => item.monthlyBalanceValue),
            definedBudgets: stats.map(item => item.definedMonthlyBudgets),
            actionCountLabels: stats.map(item => `${item.countStartDate} - ${item.monthlyBalanceDate}`),
            monthlyTransactionCounts: stats.map(item => item.transactionCount),
        }
    }, [stats]);


    const { actionLabels, dailyTransactions, dailyBudgetLabels, dailyBudgetValues } = useMemo(() => {
        if (!dailyInfo || !dailyInfo.length) {
            return { actionLabels: [], dailyTransactions: [], dailyBudgetLabels: [], dailyBudgetValues: [] };
        };

        return {
            actionLabels: dailyInfo.map(item => item.dailyActionsDate),
            dailyTransactions: dailyInfo.map(item => item.dailyActionCount),
            dailyBudgetLabels: dailyInfo.map(item => item.dailyBudgetDate),
            dailyBudgetValues: dailyInfo.map(item => item.dailyBudgetValue),
        };
    }, [dailyInfo]);

    return (
        <div id="pagecontent" className="h-full min-w-screen bg-slate-200 overflow-y-auto no-scrollbar">
            <DashboardHeader />
            <div id="middle-content" className="w-full h-full border-2 border-b-slate-800/5 flex flex-col flex-wrap items-center gap-5 mt-2">
                <div id="content-header" className="w-full flex flex-col items-start justify-start gap-2">
                    <div className="w-7/12 h-fit flex justify-center items-center border-2 border-slate-400 rounded-xl mx-auto">
                        <div className="w-full h-fit flex justify-center items-center px-3 py-3 gap-4">
                            <div id="basicHouseInfo" className="w-full h-full flex items-center gap-4">
                                <span className="flex gap-2">
                                    <span className="font-bold">House name:</span>
                                    <span>
                                        {basicHouseInfo.houseName || 'brak danych :('}
                                    </span>
                                </span>
                                <span className="text-md">&#124;</span>
                                <span className="flex gap-2">
                                    <span className="font-bold">Host's username:</span>
                                    <span>
                                        {basicHouseInfo.host || 'brak danych :('}
                                    </span>
                                </span>
                                <span className="text-md">&#124;</span>
                                <div className="w-fit flex gap-1">
                                    <span className="font-bold">Date of last balance:</span>
                                    <span>
                                        {basicHouseInfo.lastBalanceDate || '2025-01-01'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="dailyData-container" className="w-7/12 h-fit flex justify-center items-center border-2 border-slate-400 rounded-xl mx-auto text-md px-3 py-3">
                        <div id="dailyShortInfo" className="flex gap-4">
                            <p className="flex text-md gap-1">
                                <span className="font-bold">Previous day's transactions:</span>
                                <span>{dailyInfo.dailyActionCount || '65'}</span>
                            </p>
                            <span className="text-md h-full flex items-center">&#124;</span>
                            <p className="flex text-md gap-1">
                                <span className="font-bold">Previous day's budget:</span>
                                <span>{dailyInfo.dailyBudgetValue || '1500'}</span>
                            </p>
                        </div>
                    </div>
                    <div id="housemates-container" className="w-fit h-fit flex border-2 border-slate-400 rounded-xl mx-auto gap-2 p-3">
                        <p className="font-bold">Housemates:</p>
                        <p>{houseMates.length}</p>
                        <Link to='/dashboard/housemates' className="font-semibold text-slate-500 hover:text-slate-800">- View housemates list</Link>
                    </div>
                    <div id="most-active-mates" className="w-1/3 h-[2rem] flex flex-row justify-start items-center border-2 border-slate-400 mx-auto">
                        <h2 className="w-full h-fit flex justify-center">Most active mates list</h2>
                    </div>
                </div>
                <div id="content-section" className="w-full flex flex-row justify-center items-start gap-5 flex-wrap">
                    <div id="last-five-transactions" className="flex flex-col items-center gap-3 border-2 border-slate-400 px-4 mx-5 rounded-md">
                        <h2 className="text-xl flex justify-center">Last 5 transactions:</h2>
                        <TransactionsList limit={5} mainSite={true} />
                    </div>
                    <div id="charts1" className="w-full h-full flex flex-col flex-wrap justify-around items-center mb-5 flex-grow ml-4 gap-y-4 gap-x-4">
                        <div className="w-full h-fit flex justify-around gap-5">
                            <BalanceBudgetComparison data={{ labels: labels, dataValues: monthlyBalances, definedBudgets: definedBudgets }} />
                            <TransactionsOverTime data={{ labels: actionCountLabels, dataValues: monthlyTransactionCounts }} />
                        </div>

                        <div className="w-full h-full flex justify-between gap-x-5 pr-5">
                            <TransactionsPerDay data={{ labels: actionLabels, dataValues: dailyTransactions }} />
                            <BudgetPerDay data={{ labels: dailyBudgetLabels, dataValues: dailyBudgetValues }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
