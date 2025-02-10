import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from './authContext';
import { serverUrl } from "../url";
import fetchData from '../utils/fetchData';


export const DataContext = createContext({
    data: {},
    messagesData: {},
    actionsData: {},
    isLoading: true,
    messagesLoading: false,
    messagesError: null,
    actionsLoading: false,
    actionsError: null,
    refreshData: () => { },
    fetchMessages: () => { },
    fetchTransactions: () => { },
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
    const [messagesData, setMessagesData] = useState({
        messagesData: [],
        messagesDataError: null,
        loading: false,
    });

    const [actionsData, setActionsData] = useState({
        actionsData: [],
        actionsDataError: null,
        loading: false,
    })

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

    const fetchMessages = async (filter = 'messages') => {
        setMessagesData(prevData => ({ ...prevData, loading: true, messagesDataError: null }));

        try {
            const result = await fetchData(`${serverUrl}/board/data/${filter}`);
            setMessagesData(prevData => ({
                ...prevData,
                messagesData: result.dashboardData.messagesData,
                loading: false,
            }));
        } catch (error) {
            setMessagesData(prevData => ({ ...prevData, messagesDataError: error }));
        }
    };

    const fetchTransactions = async (filter = 'transactions') => {
        setActionsData(prevData => ({ ...prevData, loading: true, actionsDataError: null }));

        try {
            const result = await fetchData(`${serverUrl}/board/data/${filter}`);
            setActionsData(prevData => ({
                ...prevData,
                actionsData: result.dashboardData.actionsData,
                loading: false,
            }))
        } catch (error) {
            setActionsData(prevData => ({ ...prevData, actionsDataError: error }));
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
            messagesData: messagesData.messagesData,
            actionsData: actionsData.actionsData,
            isLoading: data.loading,
            messagesLoading: messagesData.loading,
            messagesError: messagesData.messagesDataError,
            actionsLoading: actionsData.loading,
            actionsError: actionsData.actionsDataError,
            refreshData,
            fetchMessages,
            fetchTransactions,
        }}>
            {children}
        </DataContext.Provider>
    );
};