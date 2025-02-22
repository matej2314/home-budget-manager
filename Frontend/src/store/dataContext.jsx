import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from './authContext';
import { serverUrl } from "../url";
import fetchData from '../utils/fetchData';

export const DataContext = createContext({
    data: {},
    actionsData: {},
    isLoading: true,
    actionsLoading: false,
    actionsError: null,
    actionsTotalPages: 1,
    actionsPage: 1,
    isTransactionsFetched: false,
    refreshData: () => { },
    fetchTransactions: () => { },
});

export const DataProvider = ({ children }) => {

    const { isAuthenticated } = useContext(AuthContext);
    const [isTransactionsFetched, setIsTransactionsFetched] = useState(false);

    const [data, setData] = useState({
        houseData: [],
        houseMates: [],
        actionsCatData: [],
        statsData: [],
        dailyData: [],
        dataError: null,
        loading: true,
    });

    const [actionsData, setActionsData] = useState({
        actionsData: [],
        actionsDataError: null,
        loading: false,
        totalPages: 0,
        page: 1,
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

    const fetchTransactions = async (page = 1) => {
        setActionsData(prevData => ({ ...prevData, loading: true, actionsDataError: null }));
        setIsTransactionsFetched(false);

        try {
            const result = await fetchData(`${serverUrl}/board/data/transactions/${page}`);
            setActionsData(prevData => ({
                ...prevData,
                actionsData: result.dashboardData.actionsData,
                totalPages: result.dashboardData.totalPages,
                page: result.dashboardData.page,
                loading: false,
            }));
            setIsTransactionsFetched(true);

        } catch (error) {
            setActionsData(prevData => ({ ...prevData, actionsDataError: error }));
        } finally {
            setActionsData(prevData => ({ ...prevData, loading: false }));
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
            actionsData: actionsData.actionsData,
            actionsLoading: actionsData.loading,
            actionsError: actionsData.actionsDataError,
            actionsTotalPages: actionsData.totalPages,
            actionsPage: actionsData.page,
            refreshData,
            fetchTransactions,
            isTransactionsFetched,
        }}>
            {children}
        </DataContext.Provider>
    );
};