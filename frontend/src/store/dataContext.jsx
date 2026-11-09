import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from './authContext';
import { serverUrl } from "../url";
import fetchData from '../utils/asyncUtils/fetchData';

export const DataContext = createContext({
    data: {},
    actionsData: {},
    isLoading: true,
    refreshData: () => { },

});

export const DataProvider = ({ children }) => {

    const { isAuthenticated } = useContext(AuthContext);

    const [data, setData] = useState({
        houseData: [],
        houseMates: [],
        actionsCatData: [],
        statsData: [],
        dailyData: [],
        dataError: null,
        loading: true,
    });

    const fetchBoardData = async (filter = 'all') => {
        setData(prevData => ({ ...prevData, loading: true, dataError: null }));

        try {
            const result = await fetchData(`${serverUrl}/board/data/${filter}`);
            setData((prevData) => ({
                ...prevData,
                ...(result.dashboardData.houseData && { houseData: result.dashboardData.houseData }),
                ...(result.dashboardData.houseMates && { houseMates: result.dashboardData.houseMates }),
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

    return (
        <DataContext.Provider value={{
            data,
            isLoading: data.loading,
            refreshData,
        }}>
            {children}
        </DataContext.Provider>
    );
};