import { useRef, useEffect, useContext } from 'react';
import { DataContext } from '../../store/dataContext';
import { serverUrl } from '../../url';
import sendRequest from '../../utils/sendRequest';
import { showInfoToast, showErrorToast } from '../../configs/toastify';

export default function AddTransactionForm({ onClose }) {
    const { data, isLoading, error } = useContext(DataContext);
    const actionCategories = !isLoading && !error && data.actionsCatData || [];
    const typeRef = useRef();
    const valueRef = useRef();
    const catIdRef = useRef();

    const handleSaveAction = async (e) => {
        e.preventDefault();

        const newActionData = {
            type: typeRef.current.value,
            value: valueRef.current.value,
            catId: catIdRef.current.selectedOptions[0].dataset.id,
        };

        const saveAction = await sendRequest('POST', newActionData, `${serverUrl}/action/new`)

        if (saveAction.status === 'success') {
            showInfoToast(saveAction.message);
            setTimeout(() => {
                onClose();
            }, 500);
        } else if (saveAction.status === 'error') {
            showErrorToast(saveAction.message);
            onClose();
        }
    };


    return (
        <div className='w-full h-fit flex flex-col items-center'>
            <form onSubmit={handleSaveAction} className='w-full h-fit flex flex-col items-center gap-5'>
                <label htmlFor="actionType">Select type of transaction:</label>
                <select name="actionType" id="actionType" ref={typeRef} required>
                    <option value="income">income</option>
                    <option value="expense">expense</option>
                </select>
                <label htmlFor="actionValue">Type value of transaction:</label>
                <input type="text" name="actionValue" id="actionValue" ref={valueRef} className='pl-2' required />
                <select name="actionCat" id="actionCat" ref={catIdRef}>
                    {!isLoading && !error ? (
                        actionCategories.map((cat) => (
                            <option key={cat.id} data-id={cat.id} value={cat.name}>{cat.name}</option>
                        ))
                    ) : (
                        <option value="error">error</option>
                    )}
                </select>
                <button type="submit" disabled={isLoading} className='text-xl bg-gray-300 text-black p-2 rounded-xl border-[1px] border-slate-500'>Save</button>
            </form>
        </div>
    )

}