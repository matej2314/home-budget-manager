import { useState, useRef } from 'react';
import AppModal from './AppModal';
import ModalHeader from './ModalHeader';
import { apiBaseUrl } from '../../url';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import StarRating from '../StarRating';
import LoadingModal from '../modals/LoadingModal';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import { useTranslation } from 'react-i18next';
import useApiResponseHandler from '../../hooks/useApiResponseHandler';
import SubmitBtn from '../forms/internal/SubmitBtn';

export default function AddReviewModal({ isOpen, onRequestClose }) {
    const [rating, setRating] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const userOpinionRef = useRef();
    const handleApiResponse = useApiResponseHandler();
    const { t } = useTranslation("modals");

    const handleSaveReview = async (e) => {
        e.preventDefault();

        const reviewContent = userOpinionRef.current?.value || "";

        const validUserReview = reviewContent;

        if (!validUserReview) {
            showErrorToast(t("addReview.invalidOpinion"));
            return;
        };

        const reviewData = {
            content: reviewContent,
            rating: rating,
        };

        try {
            setIsLoading(true);
            const saveReview = await sendRequest('POST', reviewData, `${apiBaseUrl}/reviews/new`)

            handleApiResponse(saveReview, {
                onSuccess: () => {
                    showInfoToast(t("addReview.correctlySaveMessage"));
                    setTimeout(onRequestClose, 600);
                },
                onError: () => {
                    showErrorToast(t("addReview.failedSaveMessage"));
                    setRating(0);
                    userOpinionRef.current.value = '';
                },
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel={t("addReview.opinionLabel")}
            className="modal-panel max-w-md"
        >
            <ModalHeader title={t("addReview.opinionLabel")} onClose={onRequestClose} />
            <form
                onSubmit={handleSaveReview}
                className="w-full flex flex-col gap-4"
            >
                <label htmlFor="choose_rating" className="text-sm font-medium text-ink">{t("addReview.ratingLabel")}</label>
                <div className="flex justify-center">
                    <StarRating
                        edit={true}
                        action={(newRating) => setRating(newRating)} size={40}
                    />
                </div>
                <label htmlFor="userOpinion" className="text-sm font-medium text-ink">{t("addReview.opinionLabel")}</label>
                <textarea
                    className="input-base min-h-[8rem] py-2.5 resize-none"
                    name="userOpinion"
                    id="userOpinion"
                    readOnly={isLoading}
                    placeholder={t("addReview.opinionPlaceholder")}
                    ref={userOpinionRef}
                />
                <div className="modal-actions">
                    <button type="button" onClick={onRequestClose} className="modal-btn-secondary">
                        {t("cancel")}
                    </button>
                    <SubmitBtn
                        className='form-submit-modal-btn'
                        disabled={isLoading}
                    >
                        {t("addReview.submitOpinionBtn")}
                    </SubmitBtn>
                </div>
            </form>
            {isLoading && <LoadingModal isOpen={isLoading} />}
        </AppModal>
    )
}
