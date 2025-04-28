import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from "@store/authContext"
import { DataProvider } from "@store/dataContext"

const queryClient = new QueryClient();

type ComponentWithProvidersProps = {
    children: ReactNode;
};

const ComponentWithProviders = ({children}: ComponentWithProvidersProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <DataProvider>
                    {children}
                </DataProvider>
            </AuthProvider>
        </QueryClientProvider>
    )
};

export default ComponentWithProviders;