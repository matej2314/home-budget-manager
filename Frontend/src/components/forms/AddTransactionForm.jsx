import { useRef, useContext, useState } from 'react';
import { Icon } from '@iconify/react';
import { DataContext } from '../../store/dataContext';
import { serverUrl } from '../../url';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import LoadingModal from '../modals/LoadingModal';

export default function AddTransactionForm({ onClose }) {
    const { data, isLoading, error } = useContext(DataContext);
    const actionCategories = !isLoading && !error && data.actionsCatData || [];
    const [imageMode, setImageMode] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [recognizedValue, setRecognizedValue] = useState();
    const typeRef = useRef();
    const numberValueRef = useRef();
    const fileValueRef = useRef();
    const catIdRef = useRef();



    const recognizeValue = async (e) => {
        e.preventDefault();
        const data = new FormData();
        const file = fileValueRef.current?.files[0];
        data.append('receipt', file);

        try {
            setLoadingImage(true)
            const recognize = await fetch(`${serverUrl}/receipt`, {
                method: 'POST',
                body: data,
                credentials: 'include',
            });

            const recognizeData = await recognize.json();

            if (recognizeData.status === 'success') {
                setImageMode(false);
                setRecognizedValue(recognizeData.value.replace(',', '.'));

            } else if (recognizeData.status === 'error') {
                showErrorToast(recognizeData.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingImage(false)
        }
    };


    const handleToggleImageMode = () => {
        setImageMode(prevMode => !prevMode);
    };

    const handleSaveAction = async (e) => {
        e.preventDefault();

        const rawValue = numberValueRef.current.value.replace(',', '.');
        const parsedValue = parseFloat(rawValue);

        if (isNaN(parsedValue)) {
            showErrorToast('Nieprawidłowa wartość liczby');
            return;
        }

        const newActionData = {
            type: typeRef.current.value,
            value: parsedValue.toFixed(2),
            catId: catIdRef.current.selectedOptions[0].dataset.id,
        };

        const saveAction = await sendRequest('POST', newActionData, `${serverUrl}/action/new`);

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
                <label htmlFor="actionType" className='text-lg font-semibold'>Select type of transaction:</label>
                <select name="actionType" id="actionType" ref={typeRef} required>
                    <option value="income">income</option>
                    <option value="expense">expense</option>
                </select>
                <label htmlFor="actionValue" className='text-lg font-semibold'>{imageMode ? 'Select image of receipt:' : 'Type value of transaction:'}</label>
                <div className='w-full h-fit flex justify-center items-center gap-3'>
                    {!imageMode ?
                        <input
                            type='text'
                            name="actionValue"
                            id="actionValue"
                            ref={numberValueRef}
                            defaultValue={recognizedValue ? recognizedValue : ''}
                            className='pl-2 text-black rounded-md'
                            required /> :
                        <input
                            type="file"
                            name="actionValue"
                            id="actionValue"
                            ref={fileValueRef}
                            className='pl-2'
                            required />}
                    <button
                        type="button"
                        onClick={handleToggleImageMode}
                        className='w-fit h-fit bg-gray-300 p-1 rounded-md border-[1px] border-slate-500 hover:bg-gray-400'
                    >
                        <Icon icon='flat-color-icons:compact-camera' width={20} height={20} />
                    </button>
                </div>
                <select name="actionCat" id="actionCat" ref={catIdRef}>
                    {!isLoading && !error ? (
                        actionCategories.map((cat) => (
                            <option key={cat.id} data-id={cat.id} value={cat.name}>{cat.name}</option>
                        ))
                    ) : (
                        <option value="error">error</option>
                    )}
                </select>
                {imageMode && <button type="button" onClick={recognizeValue} className='text-xl bg-gray-300 text-black p-2 rounded-xl border-[1px] border-slate-500'>Recognize</button>}
                <button type="submit" disabled={isLoading} className='text-xl bg-gray-300 text-black p-2 rounded-xl border-[1px] border-slate-500'>Save</button>
            </form>
            {loadingImage && <LoadingModal isOpen={loadingImage} />}
        </div>
    )

}