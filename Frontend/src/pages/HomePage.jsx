import { useEffect, useContext } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { AuthContext } from "../store/authContext";
import { showCookiesInfo } from "../configs/toastify";
import useHomePageStore from "../store/homePageStore";
import useDocumentTitle from '../hooks/useDocumentTitle';
import HomePageMenu from "../components/home-page-components/HomePageMenu";
import Home from "../components/home-page-components/Home";
// import ShortInfoSection from "../components/home-page-components/ShortInfoSection";
// import FunctionalitiesSection from "../components/home-page-components/FunctionalitiesSection";
// import GallerySection from "../components/home-page-components/GallerySection";
// import ReviewsSection from "../components/home-page-components/ReviewsSection";

export default function HomePage() {
    useDocumentTitle('Home');
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const referrer = document.referrer;

    const { homePageData, homePageDataError, isHomePageDataLoading, fetchHomePageData } = useHomePageStore();

    useEffect(() => {
        fetchHomePageData();
    }, []);



    useEffect(() => {
        if (isAuthenticated && referrer.origin === "http://localhost:5173") {
            showCookiesInfo("Ta strona korzysta z Cookies.", " Szczegóły poznasz w Polityce Prywatności lub w panelu użytkownika");
            setTimeout(() => {
                navigate("dashboard");
            }, 600);
        }

        if (!isAuthenticated && location.state?.from !== "http://localhost:5173") {
            showCookiesInfo("Ta strona korzysta z Cookies.", " Szczegóły poznasz w Polityce Prywatności lub w panelu użytkownika");
        }
    }, [isAuthenticated, referrer, navigate]);

    return (
        <>
            {!isHomePageDataLoading && !homePageDataError && homePageData && (
                <main className="max-w-screen h-screen flex flex-row justify-center items-center gap-2">
                    <div className="w-11/12 h-[90%]  rounded-md flex items-start border-t-2 bg-gradient-to-br from-[rgba(71,85,105,0.85)] via-[rgba(51,65,85,0.9)] to-[rgba(30,41,59,0.95)] backdrop-blur-[2px] shadow-[inset_0_0_12px_rgba(255,255,255,0.03),0_0_8px_rgba(255,255,255,0.02)]  bg-slate-700/90 border-slate-400/30 mx-auto md:mx-0 flex-wrap">
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
