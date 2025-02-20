import { useState, useEffect } from "react";
import StarRating from "../StarRating";
import fetchData from '../../utils/fetchData';
import { serverUrl } from '../../url';

export default function ReviewsSection() {
    const [reviews, setReviews] = useState(null);


    useEffect(() => {
        const fetchReviews = async () => {
            const reviews = await fetchData(`${serverUrl}/reviews/collection`)

            if (reviews.status === 'error') {
                console.error(reviews.message);
            } else if (reviews.status === 'success') {
                setReviews(() => reviews);
            };
        };
        fetchReviews();
    }, []);

    return (
        <div id="app-reviews" className="w-full h-fit flex flex-col justify-start items-center gap-3">
            <h2 className="text-2xl">Users reviews:</h2>
            {reviews ? <div id="reviews-boxes" className="w-full h-fit flex flex-col items-center gap-5 mb-4 text-slate-100">
                {reviews && reviews.map(review => (
                    <div
                        key={review.id}
                        id='review'
                        className="w-1/2 h-fit flex flex-row justify-start rounded-md bg-slate-300/25 border-[1px] border-slate-300 gap-2 p-3"
                    >
                        <div
                            id="photo"
                            className="w-40 h-40 rounded-full bg-gray-600">
                            <img src={`${serverUrl}/avatars/${review.userId}`} />
                        </div>
                        <div className="h-full flex flex-col items-center gap-5">
                            <div id="reviewData" className=" h-fit flex flex-col justify-start">
                                <div>
                                    <p className="w-full h-fit ml-7">{review.userName}</p>
                                </div>
                                <div className="w-full h-fit flex items-center gap-2">
                                    <StarRating rating={5} edit={false} />
                                    <p className="h-fit flex justify-start items-center">{review.date}</p>
                                </div>
                            </div>
                            <p className="w-full h-fit flex justify-start ml-6">{review.content}</p>
                        </div>
                    </div>
                ))}

            </div> : <p>No reviews yet.</p>}
        </div>
    )
}