import StarRating from '@components/StarRating';
import { serverUrl } from '../../configs/url';
import { formatDbDate } from "../../utils/formattingUtils/formatDateToDisplay";
import { useTranslation } from "react-i18next";
import { Reviews } from "@models/homePageStoreTypes";

export type ReviewsSectionProps = {
    reviews: Reviews;
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
    const { t } = useTranslation("aboutUs");

    return (
        <div id="app-reviews" className="w-full h-fit flex flex-col justify-start items-center gap-3">
            <h2 className="text-2xl font-semibold text-stone-400/80 text-center">{t("reviewsHeading")}</h2>
            {reviews ? <div id="reviews-boxes" className="w-full h-fit flex flex-col items-center gap-5 mb-4 text-slate-900">
                {reviews && reviews.map((review, index) => (
                    <div
                        key={index}
                        id='review'
                        className="w-11/12 sm:w-1/2 md:w-[25rem] h-fit flex flex-row justify-start rounded-md bg-slate-300 border-4 border-slate-600 gap-2 p-3"
                    >
                        <div
                            id="photo"
                            className="w-16 h-16 mt-3 md:mt-0 md:w-32 md:h-32 rounded-full bg-gray-600">
                            <img className=" h-full rounded-full" src={`${serverUrl}/avatars/avatar/${review.userId}`} />
                        </div>
                        <div className="h-full flex flex-col items-center md:gap-5">
                            <div id="reviewData" className=" h-fit flex flex-col justify-start">
                                <div>
                                    <p className="w-full h-fit ml-2">{reviews && review.userName}</p>
                                </div>
                                <div className="w-full h-fit flex items-center gap-2">
                                    <StarRating rating={review.rating} edit={false} size={22} />
                                    <p className="h-fit flex justify-start items-center">{formatDbDate(review.date, true)}</p>
                                </div>
                            </div>
                            <p className="w-full h-fit flex justify-start ml-6 text-xl">{review.content}</p>
                        </div>
                    </div>
                ))}

            </div> : <p>No reviews yet.</p>}
        </div>
    )
}