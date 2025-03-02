import { useState, useRef } from 'react';
import Modal from 'react-modal';
import { serverUrl } from '../../url';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { CountDeclaredBudgetPeriod } from '../../utils/countingUtils/CountDeclaredBudgetPeriod';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import LoadingModal from './LoadingModal';


export default function DeclareBudgetModal({ isOpen, onRequestClose }) {
    const [sended, setSended] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const declaredBudgetRef = useRef();
    const declaredPeriod = CountDeclaredBudgetPeriod();
    const lettersRegex = /[^0-9.,]/;

    const handleDeclareBudget = async (e) => {
        e.preventDefault();

        if (!declaredBudgetRef.current.value || lettersRegex.test(declaredBudgetRef.current.value.trim())) {
            showInfoToast('Podaj nowy budżet miesięczny!');
            return;
        };

        const budgetValue = declaredBudgetRef.current.value.trim().replace(',', '.');

        const budgetData = {
            value: +parseFloat(budgetValue).toFixed(2),
        };

        try {
            setSended(false);
            setIsLoading(true);
            const addBudget = await sendRequest('POST', budgetData, `${serverUrl}/initmonthly/new`);

            if (addBudget.status === 'error') {
                showErrorToast(addBudget.message);
            } else if (addBudget.status === 'success') {
                showInfoToast(addBudget.message);
                setTimeout(() => {
                    onRequestClose();
                }, 600);
            };
        } catch (error) {
            console.error(error);
        } finally {
            setSended(true);
            setIsLoading(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='bg-slate-200 rounded-lg p-6 w-1/3 mx-auto mt-20 shadow-lg border-4 border-slate-400'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        >
            <h2 className='w-full h-fit flex justify-center font-semibold'>Declare budget for your household</h2>
            <form onSubmit={handleDeclareBudget}
                className='w-full h-fit flex flex-col items-center gap-3 mt-3'
            >
                <label htmlFor="initBudget">Type value of new monthly budget:</label>
                <input
                    type="text"
                    name="initBudget"
                    id="initBudget"
                    ref={declaredBudgetRef}
                />
                <button
                    type="submit"
                    disabled={sended}
                    className='text-xl bg-gray-300 text-black p-2 rounded-xl border-[1px] border-slate-500 hover:bg-slate-400'
                >
                    Declare
                </button>
                <p>For period : {declaredPeriod.startPeriod} - {declaredPeriod.endPeriodString}</p>
            </form>
            {isLoading && <LoadingModal isOpen={isLoading} />}
        </Modal>
    )
}
