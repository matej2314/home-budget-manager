import MainPage from '../pages/MainPage';
import DashboardPage from '../pages/DashboardPage';

const routes = () => {
    return [
        { path: '/', element: <MainPage /> },
        { path: '/dashboard', element: <DashboardPage /> }
    ];
};

export default routes;