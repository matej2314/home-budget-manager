import { useState, useRef } from 'react';
import Modal from 'react-modal';
import { serverUrl } from '../../url';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import StarRating from '../StarRating';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import SubmitBtn from '../forms/internal/SubmitBtn';

export default function AddReviewModal({ isOpen, onRequestClose }) {
    const [rating, setRating] = useState(0);
    const userOpinionRef = useRef();

    const handleSaveReview = async (e) => {
        e.preventDefault();

        const reviewData = {
            content: userOpinionRef.current.value,
            rating: rating,
        };

        try {
            const saveReview = await sendRequest('POST', reviewData, `${serverUrl}/reviews/new`)

            if (saveReview.status === 'error') {
                console.error(saveReview.messaage)
                showErrorToast('Failed to save opinion :( Try again!');
                setRating((prevState) => 0);
                userOpinionRef.current.value = '';
            } else if (saveReview.status === 'success') {
                showInfoToast(saveReview.message);
                setTimeout(() => {
                    onRequestClose();
                }, 600);
            };
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add New Transaction"
            className="add-review-modal"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div className='w-full h-full flex flex-col justify-center items-center'>
                <form
                    onSubmit={handleSaveReview}
                    className='w-full h-fit flex flex-col items-center gap-3'
                >
                    <label htmlFor="choose_rating" className='text-xl'>Choose rating:</label>
                    <StarRating
                        edit={true}
                        action={(newRating) => setRating(newRating)} size={40}
                    />
                    <label htmlFor="userOpinion" className='text-lg font-semibold'>Type your opinion:</label>
                    <textarea
                        className='w-full h-[10rem] resize-none border-2 border-slate-300 rounded-md pl-2'
                        name="userOpinion"
                        id="userOpinion"
                        placeholder='type your opinion'
                        ref={userOpinionRef}
                    />
                    <SubmitBtn
                        className='form-submit-modal-btn'
                    >
                        Save!
                    </SubmitBtn>
                </form>
            </div>
        </Modal>
    )
}