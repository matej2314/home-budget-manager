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
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useContext(AuthContext);

    const fetchBoardData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await fetchData(`${serverUrl}/board/data`);
            setData(result);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshData = () => {
        fetchBoardData();
    };

    useEffect(() => {
        fetchBoardData();
    }, [isAuthenticated]);

    return (
        <DataContext.Provider value={{ data, isLoading, error, refreshData }}>
            {children}
        </DataContext.Provider>
    );
};