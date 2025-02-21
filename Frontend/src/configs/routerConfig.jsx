import HomePage from '../pages/HomePage';
import DashboardPage from '../pages/DashboardPage';
import DashBoard from "../components/dashboard/DashBoard";
import HouseInfoPage from '../pages/dashboard-subpages/HouseInfoPage';
import HouseMatesPage from '../pages/dashboard-subpages/HouseMatesPage';
import CalendarPage from '../pages/dashboard-subpages/CalendarPage';
import MessagesPage from '../pages/dashboard-subpages/MessagesPage';
import UserProfilePage from '../pages/dashboard-subpages/UserProfilePage';
import AdminPanelPage from '../pages/dashboard-subpages/AdminPanelPage';
import StatsPage from '../pages/dashboard-subpages/StatsPage';
import TransactionsPage from "../pages/dashboard-subpages/TransactionsPage";
import DashBoardForUser from "../pages/dashboard-subpages/DashboardForUser";
import ContactPage from '../pages/ContactPage';
import AboutUs from '../pages/AboutUsPage';
import ErrorPage from "../pages/ErrorPage";
import { HomePageDataProvider } from '../store/homePageDataContext';
import { DataProvider } from '../store/dataContext';
import { SocketProvider } from '../store/socketContext';

const routes = [
    {
        path: '/', element: <HomePageDataProvider>
            <HomePage />
        </HomePageDataProvider>,
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
            { path: 'userDashboard', element: <DashBoardForUser /> },
            { path: 'adminpanel', element: <AdminPanelPage /> },
            { path: 'stats', element: <StatsPage /> },
            { path: '*', element: <ErrorPage /> },
        ],
    },
    { path: 'aboutus', element: <AboutUs /> },
    { path: 'contact', element: <ContactPage /> },
    { path: '*', element: <ErrorPage /> },
];

export default routes;