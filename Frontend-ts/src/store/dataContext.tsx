import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./authContext";
import { serverUrl } from "url";
import fetchData from "@utils/asyncUtils/fetchData";
import {
    type
    DataProviderProps,
    DataContextType,
    Data,
    Filter,
    DashboardApiResponse
} from "@models/dataContextTypes";

export const DataContext = createContext<DataContextType>({
    data: {
        houseData: [],
        houseMates: [],
        actionsCatData: [],
        statsData: [],
        dailyData: [],
        dataError: '',
        loading: true,

    },
    isLoading: true,
    refreshData: () => { },
});

export const DataProvider = ({ children }: DataProviderProps) => {
    
    const { isAuthenticated } = useContext(AuthContext)!;

    const [data, setData] = useState<Data>({
        houseData: [],
        houseMates: [],
        actionsCatData: [],
        statsData: [],
        dailyData: [],
        dataError: '',
        loading: true,
    });

    const fetchBoardData = async (filter: Filter = 'all') => {
        setData(prevData => ({ ...prevData, loading: true, dataError: '' }));

        try {
            const result = await fetchData<DashboardApiResponse>(`${serverUrl}/board/data/${filter}`);
            setData((prevData) => ({
                ...prevData,
                ...(result.dashboardData.houseData && { houseData: result.dashboardData.houseData }),
                ...(result.dashboardData.houseMates && { houseMates: result.dashboardData.houseMates }),
                ...(result.dashboardData.actionCatData && { actionsCatData: result.dashboardData.actionCatData }),
                ...(result.dashboardData.statsData && { statsData: result.dashboardData.statsData }),
                ...(result.dashboardData.dailyData && { dailyData: result.dashboardData.dailyData }),
                loading: false,
            }));
        } catch (error: unknown) {
            const err = error as Error;
            setData(prevData => ({ ...prevData, dataError: err.message }));
        }
    };

    const refreshData = async (filter: Filter = 'all') => {
        fetchBoardData(filter);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchBoardData();
        };
    }, [isAuthenticated]);

    const dataContextValue: DataContextType = {
        data,
        isLoading: data.loading,
        refreshData
    };

    return (
        <DataContext.Provider value={dataContextValue}>
            {children}
        </DataContext.Provider>
    )

}