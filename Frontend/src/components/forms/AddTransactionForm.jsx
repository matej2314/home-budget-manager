import { useRef, useEffect, useContext, useState } from 'react';
import { DataContext } from '../../store/dataContext';
import { serverUrl } from '../../url';
import { Icon } from '@iconify/react';
import sendRequest from '../../utils/sendRequest';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import LoadingModal from '../modals/LoadingModal';

export default function AddTransactionForm({ onClose }) {
    const { data, isLoading, error } = useContext(DataContext);
    const actionCategories = !isLoading && !error && data.actionsCatData || [];
    const [imageMode, setImageMode] = useState(false);
    const [receiptValue, setReceiptValue] = useState('');
    const [loadingReceipt, setLoadingReceipt] = useState(false);
    const [readyToSend, setReadyToSend] = useState(false);
    const typeRef = useRef();
    const valueRef = useRef();
    const catIdRef = useRef();

    const toggleImageMode = () => {
        setImageMode(prevState => !prevState);
    };

    const recognizeValue = async (e) => {

        if (imageMode) {
            e.preventDefault();

            const formData = new FormData();
            formData.append('receipt', valueRef.current.files[0]);

            try {
                setLoadingReceipt(true);
                const recognize = await fetch(`${serverUrl}/receipt`, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                });

                const recognizeData = await recognize.json();

                if (recognizeData.status === 'success');
                setImageMode(false);
                setReceiptValue(() => recognizeData.value);
            } catch (error) {
                logger.error(error);
                return;
            } finally {
                setLoadingReceipt(false);
            }
        }
    };

    const saveAction = async (newActionData) => {

        try {
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
        } catch (error) {
            console.error(error);
        }

    };

    const handleSaveAction = async (e) => {
        e.preventDefault();

        if (readyToSend) {

            const newActionData = {
                type: typeRef.current.value,
                value: parseFloat(valueRef.current.value),
                catId: catIdRef.current.selectedOptions[0].dataset.id,
            };

            await saveAction(newActionData);
        };
    };

    !loadingReceipt && receiptValue && console.log(`stan: ${receiptValue}`);
    return (
        <div className='w-full h-fit flex flex-col items-center'>
            <form onSubmit={recognizeValue} className='w-full h-fit flex flex-col items-center gap-5'>
                <label htmlFor="actionType">Select type of transaction:</label>
                <select name="actionType" id="actionType" ref={typeRef} required>
                    <option value="income">income</option>
                    <option value="expense">expense</option>
                </select>
                <label htmlFor="actionValue">Type value of transaction:</label>
                <div className='w-full h-fit flex justify-center items-center gap-3'>
                    {imageMode && !loadingReceipt ? <input type="file" name="actionValue" id="actionValue" ref={valueRef} className='pl-2' required />
                        : <input type="text" name="actionValue" id="actionValue" ref={valueRef} className='pl-2 text-black' defaultValue={!loadingReceipt && receiptValue ? receiptValue : ''} required />}
                    <button type="button" onClick={toggleImageMode} className='w-fit h-fit bg-gray-300 p-1 rounded-md border-[1px] border-slate-500'><Icon icon='mdi:camera-outline' width={25} height={25} /></button>
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
                {!loadingReceipt && receiptValue &&
                    <div>
                        <p>{readyToSend ? 'Możesz zapisać transakcję.' : 'Czy odczytana kwota jest poprawna?'}</p>
                        <div className='w-full h-fit flex justify-center gap-3'>
                            <button disabled={readyToSend} type="button" onClick={() => setReadyToSend(true)}>Tak</button>
                            <button disabled={readyToSend} type="button">Nie</button>
                        </div>
                    </div>}
                <button type="submit" onClick={readyToSend ? handleSaveAction : null} disabled={isLoading || loadingReceipt} className='text-xl bg-gray-300 text-black p-2 rounded-xl border-[1px] border-slate-500'>Save</button>
            </form>
            {loadingReceipt && <LoadingModal isOpen={loadingReceipt} />}
        </div>
    )

}