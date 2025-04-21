import { useContext, useMemo, useEffect } from "react";
import { Link } from 'react-router-dom';
import { DataContext } from "@store/dataContext";
import { AuthContext } from "@store/authContext";
import { useTransactionsStore } from '@store/transactionsStore'
import useProcessedData from '@hooks/useProcessedData';
import { useDeviceType } from "@hooks/useDeviceType";
import { useTranslation } from "react-i18next";
import useDocumentTitle from '@hooks/useDocumentTitle';
import { getData } from '@utils/getData';
import DashboardHeader from "@components/dashboard/dashboardComponents/DashboardHeader";
// import TransactionsList from '@components/dashboard/dashboard-internal-components/TransactionsList';
// import BudgetPerDay from "@components/dashboard/dashboardComponents/charts-dashboard-components/BudgetPerDay";
// import TransactionsPerDay from "@components/dashboard/dashboardComponents/charts-dashboard-components/TransactionsPerDay";
// import BalanceBudgetComparison from "@components/dashboard/dashboardComponents/charts-dashboard-components/BalanceBudgetComparison";
// import TransactionsOverTime from "@components/dashboard/dashboardComponents/charts-dashboard-components/TransactionsOverTime";
import MostActiveMates from "@components/dashboard/dashboard-internal-components/MostActiveMates";
import BasicHouseInfo from "@components/dashboard/dashboard-internal-components/BasicHouseInfo";
import { HouseDataObj } from "@models/dataContextTypes";
// import DashBoardForUser from "./DashboardForUser";

export default function HouseInfoPage() {
    const { data,
        isLoading,
        contextError,
    } = useContext(DataContext);

    const { actionsLoading, actionsDataError, actionsData, isTransactionsFetched, fetchTransactions } = useTransactionsStore();
    const { user, isAuthenticated } = useContext(AuthContext)!;
    const { t } = useTranslation("pages");
    const { houseData, houseMates, statsData, dailyData } = data;
    const isMobile = useDeviceType();
    useDocumentTitle('House info');

    useEffect(() => {
        if (!isTransactionsFetched) {
            fetchTransactions(1);
        }
    }, [isTransactionsFetched]);

    const basicHouseInfo = (!isLoading && !contextError && houseData[0]) as HouseDataObj;
    const dailyInfo = getData(isLoading, String(contextError), true, dailyData, []);
    const stats = getData(isLoading, String(contextError), true, statsData, []);
    const matesData = getData(isLoading, String(contextError), true, houseMates, []);
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
                            <div className="w-10/12 h-full lg:w-7/12 lg:h-fit flex justify-center items-center border-2 border-slate-400 rounded-xl shadow shadow-slate-500 mx-auto">
                                <div className="w-full flex justify-center items-center px-3 py-3 gap-4">
                                    {basicHouseInfo && <BasicHouseInfo basicHouseInfo={basicHouseInfo} />}
                                </div>
                            </div>
                            <div
                                id="dailyData-container"
                                className="lg:w-7/12 h-fit flex justify-center items-center border-2 border-slate-400 rounded-xl shadow shadow-slate-500 mx-auto text-xs lg:text-md px-3 py-3">
                                <div id="dailyShortInfo" className="w-full h-full flex flex-row justify-center items-center gap-3">
                                    <p className="flex flex-col lg:flex-row text-md lg:gap-1">
                                        <span className="w-fit h-fit flex items-center justify-center lg:text-base font-bold">{t("houseInfo.transactionsLabel")}</span>
                                        <span className="flex justify-center text-xs lg:text-base ml-2">{dailyInfo.length ? dailyInfo[dailyInfo.length - 1].dailyActionCount : '00'}</span>
                                    </p>
                                    <span className="text-xl lg:text-md flex items-center -translate-y-1 lg:-translate-y-0.5">&#124;</span>
                                    <p className="flex flex-col lg:flex-row lg:items-center text-md gap-1">
                                        <span className="font-bold text-xs lg:text-base">{t("houseInfo.budgetLabel")}</span>
                                        <span className="flex justify-center ml-2 text-xs lg:text-base">{dailyInfo.length ? dailyInfo[dailyInfo.length - 1].dailyBudgetValue : '0000'}</span>
                                    </p>
                                </div>
                            </div>
                            <div id="housemates-container" className="w-fit h-fit flex items-center border-2 border-slate-400 rounded-xl mx-auto gap-2 p-3">
                                <p className="font-bold text-sm lg:text-base">{t("houseInfo.housematesLabel")}</p>
                                <p className="flex items-center">{houseMates.length || '1'}</p>
                                <Link to='/dashboard/housemates' className="flex items-center font-semibold text-slate-500 hover:text-slate-800"> - {t("houseInfo.housematesOpenBtn")}</Link>
                            </div>
                            <MostActiveMates isLoading={isLoading} matesData={matesData} />
                        </div>
                        <div id="content-section" className="w-full flex flex-row justify-center items-start gap-5 flex-wrap">
                            <div id="last-five-transactions" className="flex flex-col items-center gap-3  px-4 mx-5 rounded-md">
                                <h2 className="text-xl flex justify-center">{t("houseInfo.fiveActionsTitle")}</h2>
                                <TransactionsList limit={5} mainSite={true} transactions={actionsData && transactions} />
                            </div>
                            <div id="charts1" className="w-full h-full flex flex-col flex-wrap justify-around items-center mb-5 flex-grow px-5 gap-y-4 gap-x-4">
                                <div className="w-full indirect:w-full md:w-full h-fit flex flex-col lg:flex-col xl:flex-row justicy-center items-center gap-5">
                                    <BalanceBudgetComparison data={{ labels: labels, dataValues: monthlyBalances, definedBudgets: definedBudgets }} />
                                    <TransactionsOverTime data={{ labels: actionCountLabels, dataValues: monthlyTransactionCounts }} />
                                </div>

                                <div className="w-full h-fit flex flex-col md:flex-row justify-center gap-3 px-5">
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
