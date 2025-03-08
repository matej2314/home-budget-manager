import { Icon } from "@iconify/react"
import useDocumentTitle from '../hooks/useDocumentTitle';
import useHomePageStore from '../store/homePageStore';
import { getData } from "../utils/getData";
import { useIsMobile } from '../hooks/useIsMobile';

export default function AboutUs() {
    useDocumentTitle('About us');
    const { homePageData, homePageDataError, homePageDataLoading } = useHomePageStore();
    const technologies = getData(homePageDataLoading, homePageDataError, true, homePageData.technologies, []);
    const { isMobile } = useIsMobile();

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-3 px-5 xl:px-16">
            <div className="w-full h-[90%] flex flex-col justify-start items-center gap-5 rounded-md bg-slate-400/75 shadow-md shadow-slate-400 border-t-2 border-slate-400 mb-10 pt-5 overflow-auto no-scrollbar">
                <div id='welcome-text' className="w-full h-full flex flex-col justify-center items-center text-slate-100 gap-3">
                    <h2 className="text-lg md:text-2xl font-semibold text-slate-700 text-center">What is Web Home Budget Manager?</h2>
                    <p className="w-full sm:w-fit md:w-auto text-lg md:text-xl sm:text-base text-center mx-5 sm:mx-0">
                        Web Home Budget Manager is a web application that allows you to easily control the budget of your house.
                    </p>
                </div>
                <div className="w-full h-fit flex flex-col justify-center items-center text-slate-100 gap-5">
                    <h2 className="text-2xl font-semibold text-slate-700">Used technologies</h2>
                    <ol className="w-fit md:w-fit flex flex-row  flex-wrap justify-center  md:grid md:grid-cols-3 text-sm md:text-lg gap-y-4 md:gap-x-[10rem] md:mx-auto">
                        {technologies.map((tech, index) => (
                            <li
                                key={tech.id}
                                className={`w-[12rem] flex md:items-center justify-start gap-2 ${index === technologies.length - 1 ? "col-span-3 mx-auto" : ''}`}>
                                <Icon icon={tech.icon} width={isMobile ? 25 : 50} height={isMobile ? 25 : 50} />
                                {tech.name}
                            </li>

                        ))}
                    </ol>
                </div>
                <div className="w-full h-fit flex flex-col justify-center items-start text-slate-100 gap-3">
                    <h2 className="w-full text-2xl flex justify-center font-semibold text-slate-700">Gallery:</h2>
                    <div className="w-full h-[20rem] flex justify-center items-start">
                        <p className="mb-3">gallery</p>
                    </div>
                </div>
            </div>
        </div>
    )
}