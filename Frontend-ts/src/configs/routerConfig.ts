import { type RouteObject } from "react-router";
import HomePage from "@pages/HomePage";
import DashboardPageProviders from "@pages/DahsboardPageProviders";
import Home from "@components/homePageComponents/Home";
import Dashboard from "@components/dashboard/Dashboard";
import DashBoardForUser from '@pages/dashboard-subpages/DashboardForUser';
import AboutUs from '@pages/AboutUsPage';
import ContactPage from '@pages/ContactPage';
import ErrorPage from '@pages/ErrorPage';
import HouseInfoPage from '@pages/dashboard-subpages/HouseInfoPage';
import HouseMatesPage from '@pages/dashboard-subpages/HouseMatesPage';
import CalendarPage from '@pages/dashboard-subpages/CalendarPage';
import MessagesPage from "@pages/dashboard-subpages/MessagesPage";
import UserProfilePage from '@pages/dashboard-subpages/UserProfilePage';
// import StatsPage from '../pages/dashboard-subpages/StatsPage';
import TransactionsPage from "../pages/dashboard-subpages/TransactionsPage";

const routes: RouteObject[] = [
  {
    path: '/',
    Component: HomePage,
    children: [
        { index: true, Component: Home },
        { path: 'aboutus', Component: AboutUs },
        { path: 'contact', Component: ContactPage },
        { path: 'userDashboard', Component: DashBoardForUser },

    ],
},
{
    path: 'dashboard',
    Component: DashboardPageProviders,
    children: [
        { index: true, Component: Dashboard },
        { path: 'myhouse', Component: HouseInfoPage },
        { path: 'myprofile', Component: UserProfilePage },
        { path: 'transactions', Component: TransactionsPage},
        { path: 'housemates', Component: HouseMatesPage },
        { path: 'calendar', Component: CalendarPage },
        { path: 'messages/:filter?', Component: MessagesPage },
        { path: '*', Component: ErrorPage },
    ],
},
{ path: '*', Component: ErrorPage },
  ];


export default routes;