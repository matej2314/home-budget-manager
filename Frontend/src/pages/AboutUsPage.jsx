import { Icon } from "@iconify/react"
import useDocumentTitle from '../hooks/useDocumentTitle';
import useHomePageStore from '../store/homePageStore';
import { getData } from "../utils/getData";

export default function AboutUs() {
    useDocumentTitle('About us');
    const { homePageData, homePageDataError, homePageDataLoading } = useHomePageStore();
    const technologies = getData(homePageDataLoading, homePageDataError, true, homePageData.technologies, []);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-3 px-16">
            <div className="w-full h-[90%] flex flex-col justify-start items-center gap-5 rounded-md bg-slate-400/75 shadow-md shadow-slate-400 border-t-2 border-slate-400 mb-10 pt-5 overflow-auto no-scrollbar">
                <div className="w-full h-fit flex flex-col justify-start items-center text-slate-100 gap-3">
                    <h2 className="text-2xl font-semibold text-slate-700">What is Web Home Budget Manager?</h2>
                    <p className="text-xl">Web Home Budget Manager i web application which allow to easy control budget of your house.</p>
                </div>
                <div className="w-full h-fit flex flex-col justify-center items-center text-slate-100 gap-3">
                    <h2 className="text-2xl font-semibold text-slate-700">Used technologies</h2>
                    <ol className="w-full grid grid-cols-3 list-disc text-lg ml-[25vw] gap-y-4">
                        {technologies.map((tech) => (
                            <li key={tech.id} className="flex items-center gap-2">
                                <Icon icon={tech.icon} width={50} height={50} />
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