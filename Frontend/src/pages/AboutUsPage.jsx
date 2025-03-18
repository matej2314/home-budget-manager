import useDocumentTitle from '../hooks/useDocumentTitle';
import useHomePageStore from '../store/homePageStore';
import { getData } from "../utils/getData";
import { useIsMobile } from '../hooks/useIsMobile';
import { useTranslation } from 'react-i18next';
import AppGallery from "../components/home-page-components/internal/AppGallery";
import ReviewsSection from '../components/home-page-components/ReviewsSection';
import TechnologiesSection from "../components/home-page-components/TechnologiesSection";
import DescriptionSection from '../components/home-page-components/DescriptionSection';
import LoadingModal from '../components/modals/LoadingModal';

export default function AboutUs() {
    useDocumentTitle('About us');
    const { homePageData, homePageDataError, homePageDataLoading } = useHomePageStore();
    const { isMobile } = useIsMobile();
    const { t } = useTranslation('aboutUs');

    if (homePageDataLoading) {
        return <LoadingModal isOpen={homePageDataLoading} />
    }

    return (
        <div className="w-full h-full flex flex-col justify-start xl:px-16 overflow-auto">
            <div className="w-full h-[90%] flex flex-col justify-start items-center md:gap-4 rounded-md overflow-auto no-scrollbar pb-[4rem] mt-[4rem] indirect:mt-[3rem] indirectxl:mt-[3rem] sm:mt-[3rem] md:mt-5 lg:mt-[3rem] xl:mt-0">
                <DescriptionSection />
                <TechnologiesSection technologies={homePageData && homePageData.technologies} isMobile={isMobile} />
                <div className="w-full h-fit flex flex-col justify-center items-start text-slate-100 gap-3">
                    <h2 className="w-full text-2xl flex justify-center font-semibold text-stone-400/80">{t("galleryHeading")}</h2>
                    <div className="w-full h-[20rem] flex justify-center items-start">
                        <div className="w-full h-full flex justify-center items-center rounded-md ">
                            <AppGallery photos={homePageData && homePageData.shots} />
                        </div>
                    </div>
                </div>
                <ReviewsSection reviews={homePageData && homePageData.reviews} />
            </div>
        </div>
    )
}