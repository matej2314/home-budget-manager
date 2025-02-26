import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../store/authContext";
import { showCookiesInfo } from "../configs/toastify";
import useHomePageStore from "../store/homePageStore";
import HomePageMenu from "../components/home-page-components/HomePageMenu";
import ShortInfoSection from "../components/home-page-components/ShortInfoSection";
import FunctionalitiesSection from "../components/home-page-components/FunctionalitiesSection";
import GallerySection from "../components/home-page-components/GallerySection";
import ReviewsSection from "../components/home-page-components/ReviewsSection";

export default function HomePage() {
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
                <main className="w-full h-fit flex flex-col justify-start items-center gap-4 pt-1 px-5">
                    <HomePageMenu />
                    <div id="mainPageContent" className="w-[99%] h-fit flex flex-col gap-3 pb-1">
                        <div id="short-info-boxes" className="w-full h-fit flex flex-col gap-5 px-5">
                            <h2 className="w-full h-fit flex justify-center text-xl font-bold">TEST LOGIN DATA: testuser@email.pl / Test123456!! </h2>
                            <ShortInfoSection infoData={homePageData.shortInfo} isLoading={isHomePageDataLoading} error={homePageDataError} />
                            <FunctionalitiesSection isLoading={isHomePageDataLoading} error={homePageDataError} functionsData={homePageData.functionalities} />
                        </div>
                        <GallerySection />
                        <ReviewsSection reviews={homePageData.reviews} />
                        <div
                            id="footer"
                            className="w-full h-fit flex flex-row justify-center items-center text-md py-2 rounded-md shadow-sm shadow-slate-400 border-2 border-slate-300 mb-4"
                        >
                            <p>Copyright@mateo2314 2025</p>
                        </div>
                    </div>
                </main>
            )}
        </>
    );
}
