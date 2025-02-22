import { useContext, useMemo, useEffect } from "react";
import { Link } from 'react-router-dom';
import { DataContext } from "../../store/dataContext";
import { AuthContext } from "../../store/authContext";
import { useTransactionsStore } from '../../store/transactionsStore'
import useProcessedData from '../../hooks/useProcessedData';
import { getData } from '../../utils/getData';
import DashboardHeader from "../../components/dashboard/dashboardComponents/DashBoardHeader";
import TransactionsList from '../../components/dashboard/dashboard-internal-components/TransactionsList';
import BudgetPerDay from "../../components/dashboard/dashboardComponents/charts-dashboard-components/BudgetPerDay";
import TransactionsPerDay from "../../components/dashboard/dashboardComponents/charts-dashboard-components/TransactionsPerDay";
import BalanceBudgetComparison from "../../components/dashboard/dashboardComponents/charts-dashboard-components/BalanceBudgetComparison";
import TransactionsOverTime from "../../components/dashboard/dashboardComponents/charts-dashboard-components/TransactionsOverTime";
import MostActiveMates from "../../components/dashboard/dashboard-internal-components/MostActiveMates";
import BasicHouseInfo from "../../components/dashboard/dashboard-internal-components/BasicHouseInfo";
import DashBoardForUser from "./DashboardForUser";

export default function HouseInfoPage() {
    const { data,
        isLoading,
        error: contextError,
    } = useContext(DataContext);

    const { actionsLoading, actionsDataError, actionsData, isTransactionsFetched, fetchTransactions } = useTransactionsStore();
    const { user, isAuthenticated } = useContext(AuthContext);
    const { houseData, houseMates, statsData, dailyData } = data;


    useEffect(() => {
        if (!isTransactionsFetched) {
            fetchTransactions();
        }
    }, [isTransactionsFetched]);

    const basicHouseInfo = !isLoading && !contextError && houseData[0] || [];
    const dailyInfo = getData(isLoading, contextError, true, dailyData, []);
    const stats = getData(isLoading, contextError, true, statsData, []);
    const matesData = getData(isLoading, contextError, true, houseMates, []);
    const transactions = !actionsDataError && !actionsLoading && isTransactionsFetched && actionsData || [];

    const { actionCountLabels } = useMemo(() => {
        if (!stats || !stats.length) {
            return { actionCountLabels: [] };
        }
        return { actionCountLabels: stats.map(item => `${item.countStartDate} - ${item.monthlyBalanceDate}`) }
    }, [stats]);


    const { labels, monthlyBalances, definedBudgets, monthlyTransactionCounts } = useProcessedData(stats, {
        labels: 'monthlyBalanceDate',
        monthlyBalances: 'monthlyBalanceValue',
        definedBudgets: 'definedMonthlyBudgets',
        monthlyTransactionCounts: 'transactionCount',
    });

    const { actionLabels, dailyTransactions, dailyBudgetLabels, dailyBudgetValues } = useProcessedData(dailyInfo, {
        actionLabels: 'dailyActionsDate',
        dailyTransactions: 'dailyActionCount',
        dailyBudgetLabels: 'dailyBudgetDate',
        dailyBudgetValues: 'dailyBudgetValue',
    });

    return (
        <>
            {user.role === 'host' || user.role === 'mate' ? (
                <div id="pagecontent" className="h-full min-w-screen bg-slate-200 overflow-y-auto no-scrollbar">
                    <DashboardHeader />
                    <div id="middle-content" className="w-full h-full border-2 border-b-slate-800/5 flex flex-col flex-wrap items-center gap-5 mt-2">
                        <div id="content-header" className="w-full flex flex-col items-start justify-start gap-2">
                            <div className="w-7/12 h-fit flex justify-center items-center border-2 border-slate-400 rounded-xl shadow shadow-slate-500 mx-auto">
                                <div className="w-full h-fit flex justify-center items-center px-3 py-3 gap-4">
                                    <BasicHouseInfo basicHouseInfo={basicHouseInfo} />
                                </div>
                            </div>
                            <div id="dailyData-container" className="w-7/12 h-fit flex justify-center items-center border-2 border-slate-400 rounded-xl shadow shadow-slate-500 mx-auto text-md px-3 py-3">
                                <div id="dailyShortInfo" className="flex gap-4">
                                    <p className="flex text-md gap-1">
                                        <span className="font-bold">Previous day's transactions:</span>
                                        <span>{dailyInfo.length ? dailyInfo[dailyInfo.length - 1].dailyActionCount : '00'}</span>
                                    </p>
                                    <span className="text-md h-full flex items-center">&#124;</span>
                                    <p className="flex text-md gap-1">
                                        <span className="font-bold">Previous day's budget:</span>
                                        <span>{dailyInfo.length ? dailyInfo[dailyInfo.length - 1].dailyBudgetValue : '0000'}</span>
                                    </p>
                                </div>
                            </div>
                            <div id="housemates-container" className="w-fit h-fit flex border-2 border-slate-400 rounded-xl mx-auto gap-2 p-3">
                                <p className="font-bold">Housemates:</p>
                                <p>{houseMates.length || '1'}</p>
                                <Link to='/dashboard/housemates' className="font-semibold text-slate-500 hover:text-slate-800">- View housemates list</Link>
                            </div>
                            <MostActiveMates isLoading={isLoading} matesData={matesData} />
                        </div>
                        <div id="content-section" className="w-full flex flex-row justify-center items-start gap-5 flex-wrap">
                            <div id="last-five-transactions" className="flex flex-col items-center gap-3  px-4 mx-5 rounded-md">
                                <h2 className="text-xl flex justify-center">Last 5 transactions:</h2>
                                <TransactionsList limit={5} mainSite={true} transactions={actionsData && transactions} />
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
            ) : user.role === 'user' ? (
                <DashBoardForUser />
            ) : (
                <p>Create an account!</p>
            )
            }
        </>
    );
}
