import { useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../store/authContext";
import { showCookiesInfo } from "../configs/toastify";
import useHomePageStore from "../store/homePageStore";
import useDocumentTitle from '../hooks/useDocumentTitle';
import HomePageMenu from "../components/home-page-components/HomePageMenu";
import LoadingModal from "../components/modals/LoadingModal";
import { getSessionStorage, setSessionStorage } from "../utils/storageUtils";

export default function HomePage() {
    useDocumentTitle('Home');
    const { isAuthenticated, isLoading } = useContext(AuthContext);
    const { homePageData, homePageDataError, isHomePageDataLoading, fetchHomePageData } = useHomePageStore();
    const isCookiesInfo = getSessionStorage('isCookiesInfo');

    useEffect(() => {
        fetchHomePageData();
    }, []);

    useEffect(() => {
        if (isCookiesInfo && isAuthenticated) {
            return;
        } else if (!isCookiesInfo) {
            setSessionStorage('isCookiesInfo', 'true');
            showCookiesInfo("This site uses Cookies.", " You can find out the details in the Privacy Policy or in the dashboard panel");
        }

    }, [isCookiesInfo, isAuthenticated]);

    if (isLoading) {
        return <LoadingModal isOpen={isLoading} />
    }

    return (
        <>
            {!isHomePageDataLoading && !homePageDataError && homePageData && (
                <main className="w-screen h-screen flex flex-row justify-center items-center bg-slate-300 overflow-auto no-scrollbar">
                    <div
                        className="home-page-content-div md:gap-[1.5rem] lg:gap-[1rem] xl:gap-[5rem]">
                        <div className="relative w-full">
                            <HomePageMenu />
                        </div>
                        <div className="w-full h-full flex flex-col text-slate-800">
                            <Outlet />
                        </div>
                    </div>
                </main >
            )
            }
        </>
    );
}
