import { createContext } from "react";
import { useQuery } from '@tanstack/react-query';
import { serverUrl } from '../url';
import fetchData from '../utils/fetchData';


export const DataContext = createContext({
    data: {},
    isLoading: true,
    error: null,
    refreshData: () => { },
});

const dataProvider = ({ children }) => {
    const { data, isLoading, error, refetch } = useQuery(
        ['boardData'], () => fetchData(`${serverUrl}/board/data`),
        {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            enabled: true,
        }
    );

    const refreshData = () => {
        refetch();
    };

    return (
        <DataContext.Provider value={{ data, isLoading, error, refreshData }}>
            {children}
        </DataContext.Provider>
    );
};