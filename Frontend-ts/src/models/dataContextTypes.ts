import { type ReactNode } from "react";
import { type BaseApiResponse } from "@utils/asyncUtils/fetchData";

export type Page = number;

export type Filter = string;

export type HouseDataObj = {
    houseName: string;
    liveBalance: string;
    host: string;
    lastBalanceDate: string;
    lastInitialBudget: string;
    initialValidUntil: string;
    initialDefinedAt: Date;
};

export type HouseMatesObj = {
    userId: string;
    userName: string;
    role: string;
};

export type DailyDataObj = {
    dailyActionCount: number;
    houseId: string;
    dailyActionsDate: string;
    dailyBudgetValue: number;
    dailyBudgetDate: string;
};

export type StatsDataObj = {
    definedMonthlyBudgets: number;
    initMonthlyBudgetDate: string;
    initMonthlyBudgetValidDate: string;
    monthlyBalanceValue: number;
    monthlyBalanceDate: string;
    transactionCount: number;
    countStartDate: string;
    countEndDate: string;
};

export type ActionsCatObj = {
    id: string;
    name: string;
    type: string;
};

export type Data = {
    houseData: HouseDataObj[];
    houseMates: HouseMatesObj[];
    actionsCatData: ActionsCatObj[];
    statsData: StatsDataObj[];
    dailyData: DailyDataObj[];
    dataError: string;
    loading: boolean;
};

export type DataContextType = {
    data: Data;
    isLoading: boolean;
    refreshData: () => void;
};

export type DataProviderProps = {
    children: ReactNode;
};

export type DashboardData = {
    houseData: HouseDataObj[],
    houseMates: HouseMatesObj[],
    dailyData: DailyDataObj[],
    actionCatData: ActionsCatObj[],
    statsData: StatsDataObj[],
    page: Page
};



export interface DashboardApiResponse extends BaseApiResponse {
    dashboardData: DashboardData;
};