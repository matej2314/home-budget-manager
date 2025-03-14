import { Icon } from "@iconify/react"
import useDocumentTitle from '../hooks/useDocumentTitle';
import useHomePageStore from '../store/homePageStore';
import { getData } from "../utils/getData";
import { useIsMobile } from '../hooks/useIsMobile';
import AppGallery from "../components/home-page-components/internal/AppGallery";

export default function AboutUs() {
    useDocumentTitle('About us');
    const { homePageData, homePageDataError, homePageDataLoading } = useHomePageStore();
    const technologies = getData(homePageDataLoading, homePageDataError, true, homePageData.technologies, []);
    const { isMobile } = useIsMobile();

    return (
        <div className="w-full h-full flex flex-col justify-start xl:px-16 overflow-auto">
            <div className="w-full h-[90%] flex flex-col justify-start items-center gap-4 md:gap-4 rounded-md overflow-auto no-scrollbar pb-[4rem] mt-[4rem] indirect:mt-[3rem] indirectxl:mt-[3rem] sm:mt-[3rem] md:mt-5 lg:mt-[3rem] xl:mt-0">
                <div id='welcome-text' className="w-fit h-full flex flex-col justify-center items-center text-slate-100 gap-3">
                    <h2 className="text-2xl font-semibold text-stone-400/80 text-center">What is Web Home Budget Manager?</h2>
                    <p className="px-2 text-center lg:text-xl">
                        Web Home Budget Manager is a web application that allows you to easily control the budget of your house.
                    </p>
                </div>
                <div className="w-full h-fit flex flex-col justify-center items-center text-slate-100 gap-7">
                    <h2 className="text-2xl font-semibold text-stone-400/80">Used technologies</h2>
                    <ol className="w-fit md:w-fit grid grid-cols-2 indirect:text-base indirectxl:grid-cols-3 sm:grid-cols-3 sm:text-lg md:grid md:grid-cols-3 text-[0.83rem] md:text-lg gap-y-4 gap-x-[7.5rem] indirectxl:gap-x-[2rem] sm:gap-x-[5rem] md:gap-x-[6rem] md:mx-auto">
                        {technologies.map((tech, index) => (
                            <li
                                key={tech.id}
                                className={`w-[10rem] md:w-fit flex md:items-center justify-center items-center gap-[0.5rem] indirect:gap-2 ${index === technologies.length - 1 ? "col-span-3 mx-auto" : ''}`}>
                                <Icon icon={tech.icon} width={isMobile ? 25 : 50} height={isMobile ? 25 : 50} />
                                {tech.name}
                            </li>

                        ))}
                    </ol>
                </div>
                <div className="w-full h-fit flex flex-col justify-center items-start text-slate-100 gap-3">
                    <h2 className="w-full text-2xl flex justify-center font-semibold text-stone-400/80">Gallery:</h2>
                    <div className="w-full h-[20rem] flex justify-center items-start">
                        <div className="w-[960px] h-[350px] border-[1px] border-slate-300/60 rounded-md shadow-xl shadow-gray-900">
                            <AppGallery photos={homePageData && homePageData.shots} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}