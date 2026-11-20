import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from '../store/authContext';
import { showCookiesInfo } from "../configs/toastify";
import useHomePageStore from "../store/homePageStore";
import { useTranslation } from "react-i18next";
import useDocumentTitle from '../hooks/useDocumentTitle';
import HomePageMenu from "../components/home-page-components/HomePageMenu";
import LoadingModal from "../components/modals/LoadingModal";
import { getSessionStorage, setSessionStorage } from "../utils/storageUtils";

export default function HomePage() {
    useDocumentTitle('Home');
    const { isAuthenticated, loginStatus } = useAuth();
    const { fetchHomePageData } = useHomePageStore();
    const isCookiesInfo = getSessionStorage('isCookiesInfo');
    const { t } = useTranslation("common");

    useEffect(() => {
        fetchHomePageData();
    }, [fetchHomePageData]);

    useEffect(() => {
        if (isCookiesInfo && isAuthenticated) {
            return;
        } else if (!isCookiesInfo) {
            setSessionStorage('isCookiesInfo', 'true');
            showCookiesInfo(t("signUpCookiesSettings.cookiesInfoPar"), t("signUpCookiesSettings.cookiesInfoSpan"));
        }

    }, [isCookiesInfo, isAuthenticated, t]);

    if (loginStatus.isLoading) {
        return <LoadingModal isOpen={loginStatus.isLoading} />
    }

    return (
        <main className="w-full min-h-screen min-w-[320px] flex flex-col lg:flex-row justify-center items-stretch lg:items-center bg-[linear-gradient(145deg,#0f1320_0%,#1a2236_45%,#121826_100%)] overflow-auto no-scrollbar px-0 sm:px-3 lg:px-6 py-0 lg:py-6">
            <div className="home-page-content-div">
                <HomePageMenu />
                <div className="relative z-[1] w-full flex-1 flex flex-col text-slate-100 pt-16 sm:pt-20">
                    <Outlet />
                </div>
            </div>
        </main>
    );
}
