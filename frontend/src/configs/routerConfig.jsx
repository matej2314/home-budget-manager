import HomePage from '../pages/HomePage';
import DashboardPage from '../pages/DashboardPage';
import Home from '../components/home-page-components/Home';
import DashBoard from "../components/dashboard/DashBoard";
import DashBoardForUser from '../pages/dashboard-subpages/DashboardForUser';
import AboutUs from '../pages/AboutUsPage';
import ContactPage from '../pages/ContactPage';
import ErrorPage from '../pages/ErrorPage';

import HouseInfoPage from '../pages/dashboard-subpages/HouseInfoPage';
import HouseMatesPage from '../pages/dashboard-subpages/HouseMatesPage';
import CalendarPage from '../pages/dashboard-subpages/CalendarPage';
import MessagesPage from '../pages/dashboard-subpages/MessagesPage';
import UserProfilePage from '../pages/dashboard-subpages/UserProfilePage';
import StatsPage from '../pages/dashboard-subpages/StatsPage';
import TransactionsPage from "../pages/dashboard-subpages/TransactionsPage";


import AdminPanelPage from '../pages/dashboard-subpages/AdminPanelPage';
import ManageUsers from '../pages/adminpanel-subpages/ManageUsers';

import { DataProvider } from '../store/dataContext';
import { SocketProvider } from '../store/socketContext';

const routes = [
    {
        path: '/',
        element: <HomePage />,
        children: [
            { index: true, element: <Home /> },
            { path: 'aboutus', element: <AboutUs /> },
            { path: 'contact', element: <ContactPage /> },
            { path: 'userDashboard', element: <DashBoardForUser /> },

        ],
    },
    {
        path: 'dashboard',
        element: <DataProvider>
            <SocketProvider>
                <DashboardPage />
            </SocketProvider>
        </DataProvider>,
        children: [
            { index: true, element: <DashBoard /> },
            { path: 'myhouse', element: <HouseInfoPage /> },
            { path: 'myprofile', element: <UserProfilePage /> },
            { path: 'transactions', element: <TransactionsPage /> },
            { path: 'housemates', element: <HouseMatesPage /> },
            { path: 'calendar', element: <CalendarPage /> },
            { path: 'messages/:filter?', element: <MessagesPage /> },
            {
                path: 'adminpanel', element: <AdminPanelPage />,
                children: [
                    { path: 'manage-users', element: <ManageUsers /> },
                ]
            },
            { path: 'stats', element: <StatsPage /> },
            { path: '*', element: <ErrorPage /> },
        ],
    },
    { path: '*', element: <ErrorPage /> },
];

export default routes;