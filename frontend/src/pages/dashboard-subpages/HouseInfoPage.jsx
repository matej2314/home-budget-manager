import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useHouseInfoDashboard from '../../hooks/useHouseInfoDashboard';
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
    const { t } = useTranslation("pages");
    useDocumentTitle('House info');

    const {
        user,
        isLoading,
        houseMates,
        basicHouseInfo,
        dailyInfo,
        matesData,
        transactions,
        actionsData,
        chartMonthly,
        chartDaily,
    } = useHouseInfoDashboard();

    const { labels, monthlyBalances, definedBudgets, monthlyTransactionCounts, actionCountLabels } = chartMonthly;
    const { actionLabels, dailyTransactions, dailyBudgetLabels, dailyBudgetValues } = chartDaily;

    return (
        <>
            {user.role === 'host' || user.role === 'mate' ? (
                <div id="pagecontent" className="w-full min-h-full min-w-0 bg-page overflow-y-auto no-scrollbar pb-8">
                    <DashboardHeader />
                    <div id="middle-content" className="w-full px-3 sm:px-5 lg:px-8 pt-4 sm:pt-5 flex flex-col gap-4 sm:gap-5">
                        <div id="content-header" className="w-full grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                            <div className="section-card lg:col-span-2">
                                <BasicHouseInfo basicHouseInfo={basicHouseInfo} />
                            </div>
                            <div
                                id="dailyData-container"
                                className="section-card flex flex-col justify-center gap-3"
                            >
                                <div id="dailyShortInfo" className="flex flex-row flex-wrap justify-between sm:justify-start items-center gap-3 sm:gap-6">
                                    <p className="flex flex-col gap-0.5">
                                        <span className="text-xs text-muted font-medium">{t("houseInfo.transactionsLabel")}</span>
                                        <span className="text-lg font-semibold text-ink">{dailyInfo.length ? dailyInfo[dailyInfo.length - 1].dailyActionCount : '00'}</span>
                                    </p>
                                    <p className="flex flex-col gap-0.5">
                                        <span className="text-xs text-muted font-medium">{t("houseInfo.budgetLabel")}</span>
                                        <span className="text-lg font-semibold text-ink break-all">{dailyInfo.length ? dailyInfo[dailyInfo.length - 1].dailyBudgetValue : '0000'}</span>
                                    </p>
                                </div>
                            </div>
                            <div id="housemates-container" className="section-card lg:col-span-3 flex flex-wrap items-center gap-2 sm:gap-3">
                                <p className="text-sm font-medium text-muted">{t("houseInfo.housematesLabel")}</p>
                                <p className="text-lg font-semibold text-ink">{houseMates.length || '1'}</p>
                                <Link to='/dashboard/housemates' className="text-sm font-medium text-accent hover:underline ml-auto">
                                    {t("houseInfo.housematesOpenBtn")}
                                </Link>
                            </div>
                            <div className="lg:col-span-3">
                                <MostActiveMates isLoading={isLoading} matesData={matesData} />
                            </div>
                        </div>
                        <div id="content-section" className="w-full flex flex-col gap-4 sm:gap-5">
                            <div id="last-five-transactions" className="section-card flex flex-col gap-3 min-w-0">
                                <h2 className="text-base sm:text-lg font-semibold text-ink">{t("houseInfo.fiveActionsTitle")}</h2>
                                <TransactionsList limit={5} mainSite={true} transactions={actionsData && transactions} />
                            </div>
                            <div id="charts1" className="w-full min-w-0 flex flex-col gap-4 sm:gap-5">
                                <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4">
                                    <BalanceBudgetComparison data={{ labels: labels, dataValues: monthlyBalances, definedBudgets: definedBudgets }} />
                                    <TransactionsOverTime data={{ labels: actionCountLabels, dataValues: monthlyTransactionCounts }} />
                                </div>
                                <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4">
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
                <p className="p-6 text-muted">Create an account!</p>
            )
            }
        </>
    );
}
