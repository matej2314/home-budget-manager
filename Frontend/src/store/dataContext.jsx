import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from './authContext';
import { serverUrl } from "../url";
import fetchData from '../utils/fetchData';

export const DataContext = createContext({
    data: {},
    isLoading: true,
    error: null,
    refreshData: () => { },
});

export const DataProvider = ({ children }) => {
    const [data, setData] = useState({
        houseData: [],
        houseMates: [],
        actionsData: [],
        actionsCatData: [],
        messagesData: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useContext(AuthContext);

    const fetchBoardData = async (filter = 'all') => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await fetchData(`${serverUrl}/board/data/${filter}`);
            setData((prevData) => ({
                ...prevData,
                ...(result.dashboardData.houseData && { houseData: result.dashboardData.houseData }),
                ...(result.dashboardData.houseMates && { houseMates: result.dashboardData.houseMates }),
                ...(result.dashboardData.actionsData && { actionsData: result.dashboardData.actionsData }),
                ...(result.dashboardData.actionsCatData && { actionsCatData: result.dashboardData.actionsCatData }),
                ...(result.dashboardData.messagesData && { messagesData: result.dashboardData.messagesData }),
            }));
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
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
        <DataContext.Provider value={{ data, isLoading, error, refreshData }}>
            {children}
        </DataContext.Provider>
    );
};