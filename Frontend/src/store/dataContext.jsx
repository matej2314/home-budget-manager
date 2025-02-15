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
    messagesTotalPages: 1,
    actionsLoading: false,
    actionsError: null,
    actionsTotalPages: 1,
    actionsPage: 1,
    isMessagesFetched: false,
    isTransactionsFetched: false,
    refreshData: () => { },
    fetchMessages: () => { },
    fetchTransactions: () => { },
});

export const DataProvider = ({ children }) => {

    const { isAuthenticated } = useContext(AuthContext);
    const [isMessagesFetched, setIsMessagesFetched] = useState(false);
    const [isTransactionsFetched, setIsTransactionsFetched] = useState(false);
    const [actionsPage, setActionsPage] = useState(1);

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
        totalPages: 0,
        page: 1,
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

    const fetchMessages = async (page = 1) => {
        setMessagesData(prevData => ({ ...prevData, loading: true, messagesDataError: null }));
        setIsMessagesFetched(false);

        try {
            const result = await fetchData(`${serverUrl}/board/data/messages/${page}`);
            setMessagesData(prevData => ({
                ...prevData,
                messagesData: result.dashboardData.messagesData || [],
                totalPages: result.dashboardData.totalPages || 1,
                page: page,
                loading: false,
            }));
            setIsMessagesFetched(true);
        } catch (error) {
            setMessagesData(prevData => ({ ...prevData, messagesDataError: error }));
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
            messagesData: messagesData.messagesData,
            messagesLoading: messagesData.loading,
            messagesError: messagesData.messagesDataError,
            messagesTotalPages: messagesData.totalPages,
            actionsData: actionsData.actionsData,
            actionsLoading: actionsData.loading,
            actionsError: actionsData.actionsDataError,
            actionsTotalPages: actionsData.totalPages,
            actionsPage: actionsData.page,
            refreshData,
            fetchMessages,
            fetchTransactions,
            isMessagesFetched,
            isTransactionsFetched,
        }}>
            {children}
        </DataContext.Provider>
    );
};