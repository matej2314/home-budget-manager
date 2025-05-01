import { useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../store/authContext";
import { showCookiesInfo } from "../configs/toastify";
import useHomePageStore from "../store/homePageStore";
import { useTranslation } from "react-i18next";
import useDocumentTitle from '../hooks/useDocumentTitle';
import HomePageMenu from "@components/homePageComponents/HomePageMenu";
import LoadingModal from "../components/modals/LoadingModal";
import { getSessionStorage, setSessionStorage } from "../utils/storageUtils";
import { AuthContextType } from "@models/authTypes";

export default function HomePage() {
    useDocumentTitle('Home');
    const { isAuthenticated, loginStatus } = useContext(AuthContext) as AuthContextType;
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

    }, [isCookiesInfo, isAuthenticated]);

    if (loginStatus.isLoading) {
        return <LoadingModal isOpen={loginStatus.isLoading} />
    }

    return (
        <>
            <main className="w-screen lg:w-screen h-screen flex flex-row justify-between lg:justify-center items-center bg-slate-900 overflow-hidden no-scrollbar ">
                <div
                    className="home-page-content-div md:gap-[1.5rem] lg:gap-[1rem] xl:gap-[5rem]">
                    <div className="w-full flex justify-start">
                        <HomePageMenu />
                    </div>
                    <div className="w-full h-full flex flex-col text-slate-800">
                        <Outlet />
                    </div>
                </div>
            </main >
        </>
    );
}
