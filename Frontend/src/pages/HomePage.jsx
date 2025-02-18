import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../store/authContext";
import { showCookiesInfo } from "../configs/toastify";

import HomePageMenu from "../components/main-page-components/HomePageMenu"

export default function HomePage() {
    const { user, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const myDomain = window.location.origin;
    const referrer = document.referrer;

    useEffect(() => {
        if (isAuthenticated && !referrer.includes(myDomain)) {
            navigate('dashboard');
        } else {
            return;
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!referrer || !referrer.includes(myDomain)) {
            showCookiesInfo('Ta strona korzysta z Cookies.', ' Szczegóły poznasz w Polityce Prywatności lub po zalogowaniu')
        }

    }, []);

    return (
        <main className="w-full h-screen flex flex-col justify-start items-center gap-4 pt-1">
            <HomePageMenu />
            <div id='mainPageContent' className="w-[99%] h-full flex flex-col gap-3 pb-1">
                <div id="short-info-boxes" className="w-full h-fit flex flex-col gap-5 bg-sky-200 px-5">
                    <h2 className="w-full h-fit flex flex-row justify-center items-center text-black text-2xl">What is Home Budget Web Manager?</h2>
                    <div id="boxes" className="w-full h-fit flex flex-row justify-around gap-3 border-b-2 border-sky-400 pb-4">
                        <div id='infoBox' className="w-full h-fit flex flex-col items-center gap-3 border-2 border-cyan-600 rounded-md p-2 bg-cyan-300">
                            <h2 className="text-2xl">Available at your fingertips</h2>
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti architecto quod voluptatem consectetur, vel repudiandae quidem voluptas accusamus ut nesciunt.</p>
                        </div>
                        <div id='infoBox' className="w-full h-fit flex flex-col gap-3 items-center border-2 border-cyan-600 rounded-md p-2 bg-lime-500/40">
                            <h2 className="text-2xl">Only necessary information</h2>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione quis consectetur quam dolor ea nobis vitae maxime magni, velit enim!</p>
                        </div>
                        <div id='infoBox' className="w-full h-fit flex flex-col gap-3 items-center border-2 border-cyan-600 rounded-md p-2 bg-orange-300/60">
                            <h2 className="text-2xl">Completely free</h2>
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est voluptatum nam quaerat dicta, architecto magnam unde, asperiores facere enim, perferendis sunt! Tempore optio laboriosam sit, nam illum facere modi eum?</p>
                        </div>
                    </div>
                    <div id='funcionalities' className="w-full h-fit flex flex-col gap-5 border-b-2 border-sky-400">
                        <h2 className="w-full h-fit flex flex-row justify-center items-center text-black text-2xl">Main functionalities:</h2>
                        <div id="possibilities" className="w-full h-fit flex flex-col justify-around gap-3 mb-4">
                            <div id='infoBox' className="w-full h-fit flex flex-col items-center gap-3 border-2 border-cyan-600 rounded-md p-2 bg-red-400">
                                <h2 className="text-2xl">Add your own household</h2>
                                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti architecto quod voluptatem consectetur, vel repudiandae quidem voluptas accusamus ut nesciunt.</p>
                            </div>
                            <div id='infoBox' className="w-full h-fit flex flex-col gap-3 items-center border-2 border-cyan-600 rounded-md p-2 bg-amber-400">
                                <h2 className="text-2xl">Invite your housemates</h2>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione quis consectetur quam dolor ea nobis vitae maxime magni, velit enim!</p>
                            </div>
                            <div id='infoBox' className="w-full h-fit flex flex-col gap-3 items-center border-2 border-cyan-600 rounded-md p-2 bg-orange-300">
                                <h2 className="text-2xl">Take control about your household budget</h2>
                                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est voluptatum nam quaerat dicta, architecto magnam unde, asperiores facere enim, perferendis sunt! Tempore optio laboriosam sit, nam illum facere modi eum?</p>
                            </div>
                        </div>

                    </div>
                </div>
                <div id="gallery-of-the-project" className="w-full h-fit flex flex-col justify-start items-center border-b-2 border-cyan-600">
                    <h2 className="text-2xl w-full h-[10rem] flex justify-center">Gallery of the project screenshots</h2>
                </div>
                <div id="app-reviews" className="w-full h-fit flex flex-col justify-start items-center gap-3 border-b-2 border-cyan-600">
                    <h2 className="text-2xl">Users reviews:</h2>
                    <div id="reviews-boxes" className="w-full h-fit flex flex-col items-center gap-3 mb-4">
                        <div id='review' className="w-fit h-fit flex flex-row justify-start items-center rounded-md bg-amber-200 border-2 border-black gap-2 p-3">
                            <div id="photo" className="w-40 h-40 rounded-full bg-gray-600"></div>
                            <p>amet non nisi asperiores sunt optio dolores expedita architecto placeat corporis quam, laboriosam impedit molestias, voluptatum iusto.</p>
                        </div>
                        <div id='review' className="w-fit h-fit flex flex-row justify-start items-center rounded-md bg-lime-200 border-2 border-black gap-2 p-3">
                            <div id="photo" className="w-40 h-40 rounded-full bg-gray-600"></div>
                            <p>amet non nisi asperiores sunt optio dolores expedita architecto placeat corporis quam, laboriosam impedit molestias, voluptatum iusto.</p>
                        </div>
                    </div>
                </div>
                <div id="footer" className="w-full h-fit flex flex-row justify-center items-center bg-blue-600 text-white text-md py-2 rounded-md">
                    <p>Copyright@mateo2314 2025</p>
                </div>
            </div>
        </main>
    )
};