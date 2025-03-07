import { useEffect, useContext } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { AuthContext } from "../store/authContext";
import { showCookiesInfo } from "../configs/toastify";
import useHomePageStore from "../store/homePageStore";
import useDocumentTitle from '../hooks/useDocumentTitle';
import HomePageMenu from "../components/home-page-components/HomePageMenu";
import { getSessionStorage, setSessionStorage } from "../utils/storageUtils";

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
            showCookiesInfo("This site uses Cookies.", "You can find out the details in the Privacy Policy or in the dashboard panel.");
            setTimeout(() => {
                navigate("dashboard");
            }, 600);
        }

        if (!isAuthenticated && location.state?.from !== "http://localhost:5173") {
            showCookiesInfo("This site uses Cookies.", " You can find out the details in the Privacy Policy or in the dashboard panel");
        }
    }, [isAuthenticated, referrer, navigate]);

    return (
        <>
            {!isHomePageDataLoading && !homePageDataError && homePageData && (
                <main className="w-screen h-screen flex flex-row justify-center items-center gap-2 bg-slate-300">
                    <div
                        className="home-page-content-div">
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
