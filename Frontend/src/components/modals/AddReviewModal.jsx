import { useState, useRef } from 'react';
import Modal from 'react-modal';
import { serverUrl } from '../../url';
import sendRequest from '../../utils/sendRequest';
import StarRating from '../StarRating';
import { showInfoToast, showErrorToast } from '../../configs/toastify';

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
                showErrorToast('Nie udało się zapisać opinii. Spróbuj ponownie!');
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
            className="w-[400px] p-6 bg-slate-200 rounded-lg shadow-lg translate-x-[40vw] translate-y-[10vh]"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div className='w-full h-full flex flex-col justify-center items-center'>
                <form onSubmit={handleSaveReview} className='w-full h-fit flex flex-col items-center gap-3'>
                    <label htmlFor="choose_rating" className='text-xl'>Choose rating:</label>
                    <StarRating edit={true} action={(newRating) => setRating(newRating)} size={40} />
                    <label htmlFor="userOpinion" className='text-lg font-semibold'>Type your opinion:</label>
                    <textarea className='w-full h-[10rem] resize-none' name="" id="" ref={userOpinionRef} />
                    <button type="submit" className='text-xl bg-gray-300 text-black p-2 rounded-xl border-[1px] border-slate-500'>Save!</button>
                </form>
            </div>
        </Modal>
    )
}