import { Icon } from '@iconify/react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function ErrorPage() {
    const { t } = useTranslation("errorPage");
    const location = useLocation();
    useDocumentTitle('Error!');
    const isDashboardPath = location.pathname.startsWith('/dashboard');

    return (
        <div className='w-screen h-screen flex flex-col justify-center items-center text-slate-900 bg-slate-300 gap-5'>
            <h2 className='text-4xl'>{t("heading")}</h2>
            <Icon icon='mingcute:sad-fill' width={150} height={150} className='text-slate-800/80' />
            <div className='w-full h-fit flex justify-center items-center gap-3'>
                <span className='text-4xl'>&#10132;</span>
                <Link to={isDashboardPath ? '/dashboard' : '/'} className='text-3xl text-red-600'>
                    {isDashboardPath ? t("dashboardLabel") : t("homeLabel")}
                </Link>
            </div>
        </div>
    );
}
