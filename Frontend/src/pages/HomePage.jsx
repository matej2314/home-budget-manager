import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../store/authContext";
import { showCookiesInfo } from "../configs/toastify";

import HomePageMenu from "../components/home-page-components/HomePageMenu"
import ShortInfoSection from "../components/home-page-components/ShortInfoSection";
import FunctionalitiesSection from "../components/home-page-components/FunctionalitiesSection";
import GallerySection from "../components/home-page-components/GallerySection";
import ReviewsSection from "../components/home-page-components/ReviewsSection";

export default function HomePage() {
    const { user, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const referrer = document.referrer;

    useEffect(() => {
        if (isAuthenticated && !referrer.origin === 'http://localhost:5173') {
            navigate('dashboard');
        } else {
            return;
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!referrer || !referrer.includes(myDomain)) {
            showCookiesInfo('Ta strona korzysta z Cookies.', ' Szczegóły poznasz w Polityce Prywatności lub w panelu użytkownika')
        }

    }, []);

    return (
        <main className="w-full h-fit flex flex-col justify-start items-center gap-4 pt-1 px-5">
            <HomePageMenu />
            <div id='mainPageContent' className="w-[99%] h-full flex flex-col gap-3 pb-1">
                <div id="short-info-boxes" className="w-full h-fit flex flex-col gap-5 px-5">
                    <ShortInfoSection />
                    <FunctionalitiesSection />
                </div>
                <GallerySection />
                <ReviewsSection />
                <div id="footer" className="w-full h-fit flex flex-row justify-center items-center text-md py-2 rounded-md shadow-sm shadow-slate-400 border-2 border-slate-300 mb-4">
                    <p>Copyright@mateo2314 2025</p>
                </div>
            </div>
        </main>
    )
};