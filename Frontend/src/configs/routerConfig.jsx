import MainPage from "../pages/MainPage";
import DashboardPage from '../pages/DashboardPage';
import DashBoard from "../components/dashboard/DashBoard";
import HouseInfoPage from '../pages/dashboard-subpages/HouseInfoPage';
import HouseMatesPage from '../pages/dashboard-subpages/HouseMatesPage';
import CalendarPage from '../pages/dashboard-subpages/CalendarPage';
import MessagesPage from '../pages/dashboard-subpages/MessagesPage';
import UsersPage from '../pages/dashboard-subpages/UsersPage';
import HouseholdsPage from '../pages/dashboard-subpages/HouseholdsPage';
import UserProfilePage from '../pages/dashboard-subpages/UserProfilePage';
import StatsPage from '../pages/dashboard-subpages/StatsPage';
import TransactionsPage from "../pages/dashboard-subpages/TransactionsPage";
import DashBoardForUser from "../pages/dashboard-subpages/DashboardForUser";
import ErrorPage from "../pages/ErrorPage";

const routes = [
    { path: '/', element: <MainPage /> },
    {
        path: 'dashboard',
        element: <DashboardPage />,
        children: [
            { index: true, element: <DashBoard /> },
            { path: 'myhouse', element: <HouseInfoPage /> },
            { path: 'myprofile', element: <UserProfilePage /> },
            { path: 'transactions', element: <TransactionsPage /> },
            { path: 'housemates', element: <HouseMatesPage /> },
            { path: 'calendar', element: <CalendarPage /> },
            { path: 'messages/:filter?', element: <MessagesPage /> },
            { path: 'userDashboard', element: <DashBoardForUser /> },
            { path: 'users', element: <UsersPage /> },
            { path: 'households', element: <HouseholdsPage /> },
            { path: 'stats', element: <StatsPage /> },
            { path: '*', element: <ErrorPage /> },
        ],
    },
    { path: '*', element: <ErrorPage /> },
];

export default routes;