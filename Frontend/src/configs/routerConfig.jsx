import MainPage from "../pages/MainPage";
import DashboardPage from '../pages/DashboardPage';

const routes = [
    { path: '/', element: <MainPage /> },
    { path: '/dashboard', element: <DashboardPage /> }
];

export default routes;