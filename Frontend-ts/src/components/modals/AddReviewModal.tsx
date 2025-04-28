import { useState, useRef, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import Modal from 'react-modal';
import { serverUrl } from '../../url';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import StarRating from '../StarRating';
import LoadingModal from '../modals/LoadingModal';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import { useTranslation } from 'react-i18next';
import SubmitBtn from '../forms/internal/SubmitBtn';
import { type BasicModalProps } from '@models/componentsTypes/modalsTypes';
import { BaseApiResponse } from '@utils/asyncUtils/fetchData';

type ReviewData = {
    content: string;
    rating: number;
};

interface AddReviewResponse extends BaseApiResponse {
    id?: string;
};

const addReviewRequest = async (reviewData: ReviewData) => {
    return await sendRequest<ReviewData, AddReviewResponse>('POST', reviewData, `${serverUrl}/reviews/new`);
};

export default function AddReviewModal({ isOpen, onRequestClose }: BasicModalProps) {
    const [rating, setRating] = useState<number>(0);
    const [sended, setSended] = useState<boolean>(false);
    const userOpinionRef = useRef<HTMLTextAreaElement>(null);
    const { t } = useTranslation("modals");

    const { mutate: saveReview, isPending } = useMutation({
        mutationFn: addReviewRequest,
        onMutate: () => {
            setRating(0);
            setSended(false);
        },
        onSuccess: (data: AddReviewResponse) => {
            if (data.status === 'success') {
                showInfoToast(t("addReview.correctlySaveMessage"));
                setTimeout(onRequestClose, 600);
            } else if (data.status === 'error') {
                showErrorToast(t("addReview.failedSaveMessage"));
                setRating(0);
                if (userOpinionRef.current) {
                    userOpinionRef.current.value = '';
                };
                console.error(data.message);
            };
        },
        onError: (error: Error | string) => {
            showErrorToast(t("addReview.failedSaveMessage"));
            console.error(error);
        },
        onSettled: () => {
            setSended(true);
        },
    });

    const handleSaveReview = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const reviewContent = userOpinionRef.current?.value || "";

        const validUserReview = reviewContent;

        if (!validUserReview) {
            showErrorToast(t("addReview.invalidOpinion"));
            return;
        };

        const reviewData: ReviewData = {
            content: reviewContent,
            rating: rating,
        };

        await saveReview(reviewData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add new opinion"
            className="add-review-modal"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div className='w-full h-full flex flex-col justify-center items-center'>
                <form
                    onSubmit={handleSaveReview}
                    className='w-full h-fit flex flex-col items-center gap-3'
                >
                    <label htmlFor="choose_rating" className='text-xl'>{t("addReview.ratingLabel")}</label>
                    <StarRating
                        rating={rating}
                        edit={true}
                        action={(newRating: number) => setRating(newRating)} size={40}
                    />
                    <label htmlFor="userOpinion" className='text-lg font-semibold'>{t("addReview.opinionLabel")}</label>
                    <textarea
                        className='w-full h-[10rem] resize-none border-2 border-slate-300 rounded-md pl-2'
                        name="userOpinion"
                        id="userOpinion"
                        readOnly={sended || isPending}
                        placeholder={t("addReview.opinionPlaceholder")}
                        ref={userOpinionRef}
                    />
                    <SubmitBtn
                        className='form-submit-modal-btn'
                        disabled={sended || isPending}
                    >
                        {t("addReview.submitOpinionBtn")}
                    </SubmitBtn>
                </form>
            </div>
            {isPending && <LoadingModal isOpen={isPending} />}
        </Modal>
    )
}