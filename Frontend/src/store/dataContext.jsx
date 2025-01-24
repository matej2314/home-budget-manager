import { createContext, useContext } from "react";
import { AuthContext } from './authContext';
import { useQuery } from '@tanstack/react-query';
import { serverUrl } from '../url';
import fetchData from '../utils/fetchData';


export const DataContext = createContext({
    data: {},
    isLoading: true,
    error: null,
    refreshData: () => { },
});

const DataProvider = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['boardData'],
        queryFn: () => fetchData(`${serverUrl}/board/data`),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        enabled: isAuthenticated,
    });


    const refreshData = () => {
        refetch();
    };

    return (
        <DataContext.Provider value={{ data, isLoading, error, refreshData }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataProvider;