import { createContext, useState, useEffect } from "react";
import { useAuth } from './authContext';
import { apiBaseUrl } from "../url";
import fetchData from '../utils/asyncUtils/fetchData';
import { registerBoardRefresh } from '../utils/asyncUtils/boardRefreshBridge';

export const DataContext = createContext({
    data: {},
    isLoading: true,
    dataError: null,
    refreshData: () => { },
});

export const DataProvider = ({ children }) => {

    const { isAuthenticated } = useAuth();

    const [data, setData] = useState({
        houseData: [],
        inmates: [],
        actionsCatData: [],
        statsData: [],
        dailyData: [],
        dataError: null,
        loading: true,
    });

    const fetchBoardData = async (filter = 'all') => {
        setData(prevData => ({ ...prevData, loading: true, dataError: null }));

        try {
            const result = await fetchData(`${apiBaseUrl}/board/data/${filter}`);
            setData((prevData) => ({
                ...prevData,
                ...(result.dashboardData.houseData && { houseData: result.dashboardData.houseData }),
                ...(result.dashboardData.inmates && { inmates: result.dashboardData.inmates }),
                ...(result.dashboardData.actionCatData && { actionsCatData: result.dashboardData.actionCatData }),
                ...(result.dashboardData.statsData && { statsData: result.dashboardData.statsData }),
                ...(result.dashboardData.dailyData && { dailyData: result.dashboardData.dailyData }),
                loading: false,
            }));
        } catch (error) {
            setData(prevData => ({ ...prevData, dataError: error }));
        }
    };

    const refreshData = async (filter = 'all') => {
        fetchBoardData(filter);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchBoardData();
        };
    }, [isAuthenticated]);

    useEffect(() => {
        registerBoardRefresh((filter) => {
            fetchBoardData(filter);
        });
    }, []);

    return (
        <DataContext.Provider
            value={{
                data,
                isLoading: data.loading,
                dataError: data.dataError,
                refreshData,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};