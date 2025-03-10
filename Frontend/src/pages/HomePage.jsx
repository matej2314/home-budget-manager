import { useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../store/authContext";
import { showCookiesInfo } from "../configs/toastify";
import useHomePageStore from "../store/homePageStore";
import useDocumentTitle from '../hooks/useDocumentTitle';
import HomePageMenu from "../components/home-page-components/HomePageMenu";
import { getSessionStorage, setSessionStorage } from "../utils/storageUtils";

export default function HomePage() {
    useDocumentTitle('Home');
    const { isAuthenticated } = useContext(AuthContext);

    const { homePageData, homePageDataError, isHomePageDataLoading, fetchHomePageData } = useHomePageStore();

    useEffect(() => {
        fetchHomePageData();
    }, []);

    useEffect(() => {
        const isCookiesInfo = getSessionStorage('isCookiesInfo');

        if (isCookiesInfo && isAuthenticated) {
            return;
        } else if (!isCookiesInfo) {
            setSessionStorage('isCookiesInfo', 'true');
            showCookiesInfo("This site uses Cookies.", " You can find out the details in the Privacy Policy or in the dashboard panel");
        }

    }, [isAuthenticated]);

    return (
        <>
            {!isHomePageDataLoading && !homePageDataError && homePageData && (
                <main className="w-screen h-screen flex flex-row justify-center items-center bg-slate-300">
                    <div
                        className="home-page-content-div md:gap-[1.5rem] lg:gap-[1rem] xl:gap-[5rem]">
                        <div className="relative w-full">
                            <HomePageMenu />
                        </div>
                        <div className="w-full h-full flex flex-col justify-center items-center text-slate-800">
                            <Outlet />
                        </div>
                    </div>
                </main >
            )
            }
        </>
    );
}
