import DashboardPage from "./DashboardPage";
import { DataProvider } from "@store/dataContext";
import { SocketProvider } from "@store/socketContext";

export default function DashboardPageProviders() {


    return (
        <DataProvider>
            <SocketProvider>
                <DashboardPage />
            </SocketProvider>
        </DataProvider>
    );
};