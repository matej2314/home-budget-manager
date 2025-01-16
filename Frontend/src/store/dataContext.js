import { createContext, useEffect, useState } from "react";
import { serverUrl } from '../url';
import fetchData from '../utils/fetchData';


export const DataContext = createContext({
    data: {},
    isLoading: true,
    error: null,
    refreshData: () => { },
});

const dataProvider = ({ children }) => {
    const [fetchedData, setFetchedData] = useState({ data: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetchData(`${serverUrl}/board/data`);
            setFetchedData(response);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        };
    };

    useEffect(() => {
        loadData();
    }, []);


const refreshData = () => {
    loadData();
};

    return (
        <DataContext.Provider value={{ data: fetchedData, isLoading, error, refreshData }}>
            {children}
        </DataContext.Provider>
    );
};