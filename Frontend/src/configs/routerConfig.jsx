import MainPage from "../pages/MainPage";
import DashboardPage from '../pages/DashboardPage';
import DashBoard from "../components/dashboard/DashBoard";
import HouseInfoPage from '../pages/dashboard-subpages/HouseInfoPage';
import HouseMatesPage from '../pages/dashboard-subpages/HouseMatesPage';
import CalendarPage from '../pages/dashboard-subpages/CalendarPage';
import MessagesPage from '../pages/dashboard-subpages/MessagesPage';
import UsersPage from '../pages/dashboard-subpages/UsersPage';
import HouseholdsPage from '../pages/dashboard-subpages/HouseholdsPage';
import StatsPage from '../pages/dashboard-subpages/StatsPage';
import TransactionsPage from "../pages/dashboard-subpages/TransactionsPage";
import TransactionsCategoriesPage from '../pages/dashboard-subpages/TransactionsCategoriesPage';

const routes = [
    { path: '/', element: <MainPage /> },
    {
        path: 'dashboard',
        element: <DashboardPage />,
        children: [
            { index: true, element: <DashBoard /> },
            { path: 'myhouse', element: <HouseInfoPage /> },
            { path: 'transactions', element: <TransactionsPage /> },
            { path: 'housemates', element: <HouseMatesPage /> },
            { path: 'calendar', element: <CalendarPage /> },
            { path: 'messages', element: <MessagesPage /> },
            { path: 'users', element: <UsersPage /> },
            { path: 'households', element: <HouseholdsPage /> },
            { path: 'stats', element: <StatsPage /> },
            { path: 'actioncats', element: <TransactionsCategoriesPage /> }
        ],
    }
];

export default routes;